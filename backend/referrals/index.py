'''
Business: Referral program - track referrals and bonuses
Args: event - dict with httpMethod, headers, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with referral data or error
'''

import json
import os
from typing import Dict, Any, Optional
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

def get_referral_stats(user_id: int) -> Dict[str, Any]:
    '''Get referral statistics for user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get user's referral code
    cur.execute(
        "SELECT referral_code FROM users WHERE id = %s",
        (user_id,)
    )
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {'error': 'Пользователь не найден', 'code': 'USER_NOT_FOUND'}
    
    referral_code = user['referral_code']
    
    # Count referrals
    cur.execute(
        "SELECT COUNT(*) as count FROM users WHERE referred_by = %s",
        (user_id,)
    )
    referral_count = cur.fetchone()['count']
    
    # Get total bonus earned
    cur.execute(
        "SELECT COALESCE(SUM(amount), 0) as total FROM referral_bonuses WHERE user_id = %s",
        (user_id,)
    )
    total_bonus = cur.fetchone()['total']
    
    # Get available bonus
    cur.execute(
        "SELECT COALESCE(SUM(amount), 0) as available FROM referral_bonuses WHERE user_id = %s AND status = 'available'",
        (user_id,)
    )
    available_bonus = cur.fetchone()['available']
    
    cur.close()
    conn.close()
    
    return {
        'success': True,
        'referral_code': referral_code,
        'stats': {
            'total_referrals': referral_count,
            'total_bonus': float(total_bonus),
            'available_bonus': float(available_bonus)
        }
    }

def get_referral_list(user_id: int) -> Dict[str, Any]:
    '''Get list of users referred by this user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        """SELECT u.id, u.name, u.email, u.created_at,
           COALESCE(
               (SELECT SUM(l.amount) FROM loans l WHERE l.user_id = u.id AND l.status = 'repaid'),
               0
           ) as total_loans
           FROM users u
           WHERE u.referred_by = %s
           ORDER BY u.created_at DESC""",
        (user_id,)
    )
    
    referrals = cur.fetchall()
    cur.close()
    conn.close()
    
    # Convert to list of dicts
    referrals_list = []
    for ref in referrals:
        ref_dict = dict(ref)
        ref_dict['created_at'] = ref_dict['created_at'].isoformat()
        referrals_list.append(ref_dict)
    
    return {
        'success': True,
        'referrals': referrals_list
    }

def get_bonus_history(user_id: int) -> Dict[str, Any]:
    '''Get bonus history for user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        """SELECT rb.id, rb.amount, rb.status, rb.source, rb.created_at,
           u.name as referral_name, u.email as referral_email
           FROM referral_bonuses rb
           LEFT JOIN users u ON rb.referred_user_id = u.id
           WHERE rb.user_id = %s
           ORDER BY rb.created_at DESC""",
        (user_id,)
    )
    
    bonuses = cur.fetchall()
    cur.close()
    conn.close()
    
    # Convert to list of dicts
    bonuses_list = []
    for bonus in bonuses:
        bonus_dict = dict(bonus)
        bonus_dict['created_at'] = bonus_dict['created_at'].isoformat()
        bonuses_list.append(bonus_dict)
    
    return {
        'success': True,
        'bonuses': bonuses_list
    }

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
            
            # Get referral stats
            if params.get('stats') == 'true':
                result = get_referral_stats(user_id)
                
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
            
            # Get referral list
            elif params.get('list') == 'true':
                result = get_referral_list(user_id)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            # Get bonus history
            elif params.get('bonuses') == 'true':
                result = get_bonus_history(user_id)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps(result)
                }
            
            # Default: get stats
            else:
                result = get_referral_stats(user_id)
                
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
