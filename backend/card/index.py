'''
Business: Virtual card management with SBP transfers
Args: event - dict with httpMethod, body, headers, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with card data or transaction result
'''

import json
import os
from typing import Dict, Any, Optional
from datetime import datetime
import secrets
import psycopg2
from psycopg2.extras import RealDictCursor
import jwt

JWT_SECRET = os.environ.get('JWT_SECRET', 'labubu-finance-secret-key-2024')
JWT_ALGORITHM = 'HS256'

def get_db_connection():
    '''Get database connection using DATABASE_URL'''
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    '''Verify JWT token and return payload'''
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except:
        return None

def generate_card_number() -> str:
    '''Generate random virtual card number'''
    # Generate 16-digit card number (not real, just for display)
    return ''.join([str(secrets.randbelow(10)) for _ in range(16)])

def get_or_create_card(user_id: int) -> Dict[str, Any]:
    '''Get existing card or create new one for user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if card exists
    cur.execute(
        "SELECT id, card_number, balance, status, created_at FROM virtual_cards WHERE user_id = %s",
        (user_id,)
    )
    card = cur.fetchone()
    
    if card:
        cur.close()
        conn.close()
        
        card_dict = dict(card)
        card_dict['created_at'] = card_dict['created_at'].isoformat()
        
        # Mask card number for security (show only last 4 digits)
        card_dict['card_number_masked'] = '**** **** **** ' + card_dict['card_number'][-4:]
        
        return {
            'success': True,
            'card': card_dict
        }
    
    # Create new card
    card_number = generate_card_number()
    
    cur.execute(
        """INSERT INTO virtual_cards (user_id, card_number, balance, status, created_at) 
           VALUES (%s, %s, 0, 'active', NOW()) 
           RETURNING id, card_number, balance, status, created_at""",
        (user_id, card_number)
    )
    
    new_card = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    card_dict = dict(new_card)
    card_dict['created_at'] = card_dict['created_at'].isoformat()
    card_dict['card_number_masked'] = '**** **** **** ' + card_number[-4:]
    
    return {
        'success': True,
        'card': card_dict
    }

def create_sbp_transfer(user_id: int, phone: str, amount: float, comment: str) -> Dict[str, Any]:
    '''Create SBP transfer from virtual card'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get user's card
    cur.execute(
        "SELECT id, balance FROM virtual_cards WHERE user_id = %s AND status = 'active'",
        (user_id,)
    )
    card = cur.fetchone()
    
    if not card:
        cur.close()
        conn.close()
        return {'error': 'Виртуальная карта не найдена', 'code': 'CARD_NOT_FOUND'}
    
    # Check balance
    if card['balance'] < amount:
        cur.close()
        conn.close()
        return {'error': 'Недостаточно средств на карте', 'code': 'INSUFFICIENT_FUNDS'}
    
    # Create transaction
    cur.execute(
        """INSERT INTO card_transactions 
           (card_id, type, amount, phone, comment, status, created_at) 
           VALUES (%s, 'sbp_transfer', %s, %s, %s, 'completed', NOW()) 
           RETURNING id, created_at""",
        (card['id'], amount, phone, comment)
    )
    
    transaction = cur.fetchone()
    
    # Update card balance
    new_balance = card['balance'] - amount
    cur.execute(
        "UPDATE virtual_cards SET balance = %s WHERE id = %s",
        (new_balance, card['id'])
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'success': True,
        'transaction': {
            'id': transaction['id'],
            'amount': amount,
            'phone': phone,
            'new_balance': new_balance,
            'created_at': transaction['created_at'].isoformat()
        }
    }

def get_card_transactions(user_id: int, limit: int = 50) -> Dict[str, Any]:
    '''Get transaction history for user's card'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get card
    cur.execute(
        "SELECT id FROM virtual_cards WHERE user_id = %s",
        (user_id,)
    )
    card = cur.fetchone()
    
    if not card:
        cur.close()
        conn.close()
        return {'error': 'Виртуальная карта не найдена', 'code': 'CARD_NOT_FOUND'}
    
    # Get transactions
    cur.execute(
        """SELECT id, type, amount, phone, comment, status, created_at 
           FROM card_transactions 
           WHERE card_id = %s 
           ORDER BY created_at DESC 
           LIMIT %s""",
        (card['id'], limit)
    )
    
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    
    # Convert to list
    trans_list = []
    for trans in transactions:
        trans_dict = dict(trans)
        trans_dict['created_at'] = trans_dict['created_at'].isoformat()
        trans_list.append(trans_dict)
    
    return {
        'success': True,
        'transactions': trans_list
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    # Verify authentication
    auth_token = event.get('headers', {}).get('X-Auth-Token') or event.get('headers', {}).get('x-auth-token')
    
    if not auth_token:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Требуется авторизация'})
        }
    
    payload = verify_token(auth_token)
    if not payload:
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Недействительный токен'})
        }
    
    user_id = payload['user_id']
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            
            # Get transactions
            if params.get('transactions') == 'true':
                result = get_card_transactions(user_id)
                
                if 'error' in result:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps(result)
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            # Get card info
            else:
                result = get_or_create_card(user_id)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'sbp_transfer':
                result = create_sbp_transfer(
                    user_id=user_id,
                    phone=body.get('phone', ''),
                    amount=float(body.get('amount', 0)),
                    comment=body.get('comment', '')
                )
                
                if 'error' in result:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps(result)
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'Неизвестное действие'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Метод не поддерживается'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
