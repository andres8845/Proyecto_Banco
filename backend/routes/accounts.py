from flask import Blueprint, request, jsonify
from models.Cuenta import Cuenta
from models.Cliente import Cliente
from utils.auth import decode_token

accounts_bp = Blueprint('accounts', __name__)

def get_user_id_from_token():
    """Obtiene el ID del usuario desde el token"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        token = auth_header.split(" ")[1]
        payload = decode_token(token)
        return payload['user_id'] if payload else None
    except:
        return None

@accounts_bp.route('/', methods=['GET'])
def get_accounts():
    """Obtiene todas las cuentas del usuario autenticado"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        cuentas = Cuenta.obtener_cuentas_por_cliente(user_id)
        
        return jsonify({
            'accounts': cuentas,
            'total': len(cuentas)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@accounts_bp.route('/', methods=['POST'])
def create_account():
    """Crea una nueva cuenta bancaria"""
    try:
        print("=" * 60)
        print("🔵 CREAR CUENTA - Inicio")
        
        user_id = get_user_id_from_token()
        print(f"🔵 User ID: {user_id}")
        
        if not user_id:
            print("❌ No autenticado")
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        print(f"🔵 Datos recibidos: {data}")
        
        # Validar tipo de cuenta
        tipo_cuenta = data.get('tipo_cuenta', 'ahorro')
        if tipo_cuenta not in ['ahorro', 'corriente']:
            print(f"❌ Tipo de cuenta inválido: {tipo_cuenta}")
            return jsonify({'message': 'Tipo de cuenta inválido. Use "ahorro" o "corriente"'}), 400
        
        # Obtener saldo inicial
        saldo_inicial = float(data.get('saldo_inicial', 0))
        print(f"🔵 Tipo: {tipo_cuenta}, Saldo inicial: {saldo_inicial}")
        
        # Parámetros específicos según tipo de cuenta
        kwargs = {}
        if tipo_cuenta == 'ahorro':
            kwargs['tasa_interes'] = float(data.get('tasa_interes', 3.5))
            kwargs['limite_retiros'] = int(data.get('limite_retiros', 5))
        elif tipo_cuenta == 'corriente':
            kwargs['limite_descubierto'] = float(data.get('limite_descubierto', 0.00))
        
        print(f"🔵 Kwargs: {kwargs}")
        
        # Crear cuenta
        cuenta, error = Cuenta.crear_cuenta(user_id, tipo_cuenta, saldo_inicial, **kwargs)
        
        if error:
            print(f"❌ Error al crear: {error}")
            return jsonify({'message': error}), 400
        
        print(f"✅ Cuenta creada: {cuenta['numero_cuenta']}")
        print("=" * 60)
        
        return jsonify({
            'message': 'Cuenta creada exitosamente',
            'account': cuenta
        }), 201
    
    except Exception as e:
        print(f"❌ EXCEPCIÓN: {str(e)}")
        import traceback
        traceback.print_exc()
        print("=" * 60)
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@accounts_bp.route('/<numero_cuenta>', methods=['GET'])
def get_account_by_number(numero_cuenta):
    """Obtiene información detallada de una cuenta"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        cuenta = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        # Verificar que la cuenta pertenezca al usuario
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        return jsonify({
            'account': cuenta
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@accounts_bp.route('/id/<id_cuenta>', methods=['GET'])
def get_account_by_id(id_cuenta):
    """Obtiene información detallada de una cuenta por ID"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        from utils.file_manager import read_json
        cuentas = read_json('cuentas.json')
        cuenta = next((c for c in cuentas if c['id_cuenta'] == id_cuenta), None)
        
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        # Verificar que la cuenta pertenezca al usuario
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        return jsonify({
            'account': cuenta
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@accounts_bp.route('/stats', methods=['GET'])
def get_accounts_stats():
    """Obtiene estadísticas de las cuentas del usuario"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        cuentas = Cuenta.obtener_cuentas_por_cliente(user_id)
        
        # Calcular estadísticas
        total_balance = sum(float(c.get('saldo', 0)) for c in cuentas)
        total_cuentas_ahorro = sum(1 for c in cuentas if c.get('tipo_cuenta') == 'ahorro')
        total_cuentas_corriente = sum(1 for c in cuentas if c.get('tipo_cuenta') == 'corriente')
        
        return jsonify({
            'total_balance': round(total_balance, 2),
            'total_accounts': len(cuentas),
            'savings_accounts': total_cuentas_ahorro,
            'checking_accounts': total_cuentas_corriente,
            'active_accounts': sum(1 for c in cuentas if c.get('estado') == 'activa')
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500
