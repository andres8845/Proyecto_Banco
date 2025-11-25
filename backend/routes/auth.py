from flask import Blueprint, request, jsonify
from models.Cliente import Cliente
from utils.auth import hash_password, verify_password, generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Registro de nuevo usuario"""
    try:
        print("=" * 50)
        print("🔵 RECIBIDA PETICIÓN DE REGISTRO")
        print("=" * 50)
        
        data = request.get_json()
        print(f"📦 Datos recibidos: {data}")
        
        # Validar campos requeridos
        required_fields = ['nombre', 'apellido', 'dni', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                print(f"❌ Campo faltante: {field}")
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        print("✅ Todos los campos requeridos presentes")
        
        # Crear cliente
        cliente, error = Cliente.crear_cliente(
            nombre=data['nombre'],
            apellido=data['apellido'],
            dni=data['dni'],
            direccion=data.get('direccion', ''),
            telefono=data.get('telefono', ''),
            email=data['email'],
            password=data['password']
        )
        
        if error:
            print(f"❌ Error al crear cliente: {error}")
            return jsonify({'message': error}), 400
        
        print(f"✅ Cliente creado: {cliente['id_cliente']}")
        
        # Generar token
        token = generate_token(cliente['id_cliente'], cliente['email'])
        print(f"✅ Token generado")
        
        return jsonify({
            'message': 'Usuario registrado exitosamente',
            'token': token,
            'user': cliente
        }), 201
    
    except Exception as e:
        print(f"❌ EXCEPCIÓN: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Inicio de sesión"""
    try:
        data = request.get_json()
        print("\n" + "=" * 60)
        print("🔵 LOGIN - Datos recibidos:", data)
        
        # Validar campos
        if not data.get('email') or not data.get('password'):
            print("❌ Campos faltantes")
            return jsonify({'message': 'Email y contraseña son requeridos'}), 400
        
        # Buscar cliente
        cliente = Cliente.obtener_cliente_por_email(data['email'])
        if not cliente:
            print(f"❌ Usuario no encontrado: {data['email']}")
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        print(f"✅ Usuario encontrado: {cliente['email']}")
        print(f"🔑 Password enviado: {data['password']}")
        print(f"🔑 Password hash almacenado: {cliente['password']}")
        print(f"🔑 Password hash calculado: {hash_password(data['password'])}")
        
        # Verificar contraseña
        if not verify_password(data['password'], cliente['password']):
            print("❌ Contraseña incorrecta")
            return jsonify({'message': 'Credenciales inválidas'}), 401
        
        # Generar token
        token = generate_token(cliente['id_cliente'], cliente['email'])
        
        # Remover password del cliente
        cliente_safe = {k: v for k, v in cliente.items() if k != 'password'}
        
        return jsonify({
            'message': 'Inicio de sesión exitoso',
            'token': token,
            'user': cliente_safe
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Obtiene información del usuario actual (requiere token)"""
    try:
        # Obtener token del header
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Token no proporcionado'}), 401
        
        try:
            token = auth_header.split(" ")[1]
        except IndexError:
            return jsonify({'message': 'Formato de token inválido'}), 401
        
        # Decodificar token
        from utils.auth import decode_token
        payload = decode_token(token)
        if not payload:
            return jsonify({'message': 'Token inválido o expirado'}), 401
        
        # Obtener cliente
        cliente = Cliente.obtener_cliente_por_id(payload['user_id'])
        if not cliente:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        return jsonify({
            'user': cliente
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500
