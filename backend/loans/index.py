'''
Business: Loan management system - create applications, get loan list and history
Args: event - dict with httpMethod, body, queryStringParameters, headers
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with loan data or error
'''

import json
import os
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
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

def create_loan_application(user_id: int, amount: float, term_days: int, purpose: str) -> Dict[str, Any]:
    '''Create new loan application'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Calculate interest and total repayment
    daily_rate = 0.003  # 0.3% per day
    interest = amount * daily_rate * term_days
    total_repayment = amount + interest
    due_date = datetime.now() + timedelta(days=term_days)
    
    # Insert loan application
    cur.execute(
        """INSERT INTO loans 
        (user_id, amount, term_days, interest_rate, interest_amount, total_repayment, 
         purpose, status, created_at, due_date) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s) 
        RETURNING id, status, created_at""",
        (user_id, amount, term_days, daily_rate, interest, total_repayment, 
         purpose, 'pending', due_date)
    )
    
    loan = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'success': True,
        'loan': {
            'id': loan['id'],
            'amount': amount,
            'term_days': term_days,
            'interest_amount': interest,
            'total_repayment': total_repayment,
            'status': loan['status'],
            'created_at': loan['created_at'].isoformat(),
            'due_date': due_date.isoformat()
        }
    }

def get_user_loans(user_id: int, status: Optional[str] = None) -> Dict[str, Any]:
    '''Get all loans for user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    if status:
        cur.execute(
            """SELECT id, amount, term_days, interest_rate, interest_amount, 
               total_repayment, paid_amount, purpose, status, created_at, due_date, 
               approved_at, disbursed_at, repaid_at 
               FROM loans WHERE user_id = %s AND status = %s 
               ORDER BY created_at DESC""",
            (user_id, status)
        )
    else:
        cur.execute(
            """SELECT id, amount, term_days, interest_rate, interest_amount, 
               total_repayment, paid_amount, purpose, status, created_at, due_date, 
               approved_at, disbursed_at, repaid_at 
               FROM loans WHERE user_id = %s 
               ORDER BY created_at DESC""",
            (user_id,)
        )
    
    loans = cur.fetchall()
    cur.close()
    conn.close()
    
    # Convert dates to ISO format
    loans_list = []
    for loan in loans:
        loan_dict = dict(loan)
        for key in ['created_at', 'due_date', 'approved_at', 'disbursed_at', 'repaid_at']:
            if loan_dict.get(key):
                loan_dict[key] = loan_dict[key].isoformat()
        loans_list.append(loan_dict)
    
    return {
        'success': True,
        'loans': loans_list
    }

def get_loan_by_id(user_id: int, loan_id: int) -> Dict[str, Any]:
    '''Get specific loan details'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        """SELECT id, amount, term_days, interest_rate, interest_amount, 
           total_repayment, paid_amount, purpose, status, created_at, due_date, 
           approved_at, disbursed_at, repaid_at 
           FROM loans WHERE id = %s AND user_id = %s""",
        (loan_id, user_id)
    )
    
    loan = cur.fetchone()
    cur.close()
    conn.close()
    
    if not loan:
        return {'error': 'Займ не найден', 'code': 'LOAN_NOT_FOUND'}
    
    loan_dict = dict(loan)
    for key in ['created_at', 'due_date', 'approved_at', 'disbursed_at', 'repaid_at']:
        if loan_dict.get(key):
            loan_dict[key] = loan_dict[key].isoformat()
    
    return {
        'success': True,
        'loan': loan_dict
    }

def get_loan_stats(user_id: int) -> Dict[str, Any]:
    '''Get user loan statistics'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get active loans
    cur.execute(
        "SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM loans WHERE user_id = %s AND status = 'active'",
        (user_id,)
    )
    active = cur.fetchone()
    
    # Get total loans
    cur.execute(
        "SELECT COUNT(*) as count FROM loans WHERE user_id = %s",
        (user_id,)
    )
    total = cur.fetchone()
    
    # Get completed loans
    cur.execute(
        "SELECT COUNT(*) as count FROM loans WHERE user_id = %s AND status = 'repaid'",
        (user_id,)
    )
    completed = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return {
        'success': True,
        'stats': {
            'active_loans': active['count'],
            'active_amount': float(active['total']),
            'total_loans': total['count'],
            'completed_loans': completed['count']
        }
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
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'create':
                result = create_loan_application(
                    user_id=user_id,
                    amount=float(body.get('amount', 0)),
                    term_days=int(body.get('term_days', 0)),
                    purpose=body.get('purpose', '')
                )
                
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
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            
            # Get specific loan
            if params.get('loan_id'):
                result = get_loan_by_id(user_id, int(params['loan_id']))
                
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
            
            # Get loan stats
            elif params.get('stats') == 'true':
                result = get_loan_stats(user_id)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            # Get all loans
            else:
                status = params.get('status')
                result = get_user_loans(user_id, status)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
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
