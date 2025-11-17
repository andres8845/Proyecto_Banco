import jwt
import hashlib
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify

# Clave secreta para JWT (en producción debería estar en variables de entorno)
SECRET_KEY = "tu_clave_secreta_super_segura_2024"

def hash_password(password):
    """Hashea una contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, hashed_password):
    """Verifica si una contraseña coincide con su hash"""
    return hash_password(password) == hashed_password

def generate_token(user_id, email):
    """Genera un token JWT"""
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    """Decodifica un token JWT"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorador para proteger rutas que requieren autenticación"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Obtener token del header Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Token inválido'}), 401
        
        if not token:
            return jsonify({'message': 'Token no proporcionado'}), 401
        
        # Verificar token
        payload = decode_token(token)
        if not payload:
            return jsonify({'message': 'Token inválido o expirado'}), 401
        
        # Pasar el user_id a la función
        return f(payload['user_id'], *args, **kwargs)
    
    return decorated
