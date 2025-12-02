'''
Business: User authentication system with registration and login
Args: event - dict with httpMethod, body, queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response dict with JWT token or error
'''

import json
import os
import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

# JWT secret key
JWT_SECRET = os.environ.get('JWT_SECRET', 'labubu-finance-secret-key-2024')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 30  # 30 days

def get_db_connection():
    '''Get database connection using DATABASE_URL'''
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        raise Exception('DATABASE_URL not found in environment')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def hash_password(password: str) -> str:
    '''Hash password using SHA-256'''
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id: int, email: str) -> str:
    '''Generate JWT token for user'''
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    '''Verify JWT token and return payload'''
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def register_user(email: str, password: str, phone: str, name: str, referral_code: Optional[str] = None) -> Dict[str, Any]:
    '''Register new user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Check if user exists
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {'error': 'Пользователь с таким email уже существует', 'code': 'USER_EXISTS'}
    
    # Hash password
    password_hash = hash_password(password)
    
    # Generate unique referral code
    user_referral_code = secrets.token_urlsafe(8)
    
    # Get referrer user_id if referral code provided
    referrer_id = None
    if referral_code:
        cur.execute("SELECT id FROM users WHERE referral_code = %s", (referral_code,))
        referrer = cur.fetchone()
        if referrer:
            referrer_id = referrer['id']
    
    # Insert user
    cur.execute(
        "INSERT INTO users (email, password_hash, phone, name, referral_code, referred_by, created_at) VALUES (%s, %s, %s, %s, %s, %s, NOW()) RETURNING id",
        (email, password_hash, phone, name, user_referral_code, referrer_id)
    )
    user_id = cur.fetchone()['id']
    
    conn.commit()
    cur.close()
    conn.close()
    
    # Generate token
    token = generate_token(user_id, email)
    
    return {
        'success': True,
        'token': token,
        'user': {
            'id': user_id,
            'email': email,
            'name': name,
            'phone': phone,
            'referral_code': user_referral_code
        }
    }

def login_user(email: str, password: str) -> Dict[str, Any]:
    '''Login existing user'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Get user
    password_hash = hash_password(password)
    cur.execute(
        "SELECT id, email, name, phone, referral_code FROM users WHERE email = %s AND password_hash = %s",
        (email, password_hash)
    )
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not user:
        return {'error': 'Неверный email или пароль', 'code': 'INVALID_CREDENTIALS'}
    
    # Generate token
    token = generate_token(user['id'], user['email'])
    
    return {
        'success': True,
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'name': user['name'],
            'phone': user['phone'],
            'referral_code': user['referral_code']
        }
    }

def get_user_profile(user_id: int) -> Dict[str, Any]:
    '''Get user profile by ID'''
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, email, name, phone, referral_code, created_at FROM users WHERE id = %s",
        (user_id,)
    )
    user = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not user:
        return {'error': 'Пользователь не найден', 'code': 'USER_NOT_FOUND'}
    
    return {
        'success': True,
        'user': dict(user)
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
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                result = register_user(
                    email=body.get('email'),
                    password=body.get('password'),
                    phone=body.get('phone'),
                    name=body.get('name'),
                    referral_code=body.get('referral_code')
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
            
            elif action == 'login':
                result = login_user(
                    email=body.get('email'),
                    password=body.get('password')
                )
                
                if 'error' in result:
                    return {
                        'statusCode': 401,
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
        
        elif method == 'GET':
            # Get user profile
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
            
            result = get_user_profile(payload['user_id'])
            
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
