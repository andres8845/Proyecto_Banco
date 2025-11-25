from flask import Blueprint, request, jsonify
from models.Transaccion import Transaccion
from models.Cuenta import Cuenta
from utils.auth import decode_token

transactions_bp = Blueprint('transactions', __name__)

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

@transactions_bp.route('/', methods=['GET'])
def get_transactions():
    """Obtiene todas las transacciones del usuario autenticado"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Ordenar por fecha descendente
        transacciones.sort(key=lambda x: x['fecha_hora'], reverse=True)
        
        return jsonify({
            'transactions': transacciones,
            'total': len(transacciones)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/recent', methods=['GET'])
def get_recent_transactions():
    """Obtiene las últimas 10 transacciones del usuario"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Ordenar por fecha descendente y tomar las primeras 10
        transacciones.sort(key=lambda x: x['fecha_hora'], reverse=True)
        transacciones_recientes = transacciones[:10]
        
        return jsonify({
            'transactions': transacciones_recientes,
            'total': len(transacciones_recientes)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/transfer', methods=['POST'])
def create_transfer():
    """Realiza una transferencia entre cuentas"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['cuenta_origen', 'cuenta_destino', 'monto']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Verificar que la cuenta origen pertenezca al usuario
        cuenta_origen = Cuenta.obtener_cuenta_por_numero(data['cuenta_origen'])
        if not cuenta_origen:
            return jsonify({'message': 'Cuenta origen no encontrada'}), 404
        
        if cuenta_origen['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado para usar esta cuenta'}), 403
        
        # Crear transacción
        transaccion, error = Transaccion.crear_transaccion(
            numero_cuenta_origen=data['cuenta_origen'],
            tipo='transferencia',
            monto=float(data['monto']),
            numero_cuenta_destino=data['cuenta_destino'],
            descripcion=data.get('descripcion', 'Transferencia')
        )
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Transferencia realizada exitosamente',
            'transaction': transaccion
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/deposit', methods=['POST'])
def create_deposit():
    """Realiza un depósito en una cuenta"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        
        # Validar campos requeridos
        if 'numero_cuenta' not in data or 'monto' not in data:
            return jsonify({'message': 'Número de cuenta y monto son requeridos'}), 400
        
        # Verificar que la cuenta pertenezca al usuario
        cuenta = Cuenta.obtener_cuenta_por_numero(data['numero_cuenta'])
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado para usar esta cuenta'}), 403
        
        # Crear transacción
        transaccion, error = Transaccion.crear_transaccion(
            numero_cuenta_origen=data['numero_cuenta'],
            tipo='deposito',
            monto=float(data['monto']),
            descripcion=data.get('descripcion', 'Depósito')
        )
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Depósito realizado exitosamente',
            'transaction': transaccion
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/withdraw', methods=['POST'])
def create_withdrawal():
    """Realiza un retiro de una cuenta"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        
        # Validar campos requeridos
        if 'numero_cuenta' not in data or 'monto' not in data:
            return jsonify({'message': 'Número de cuenta y monto son requeridos'}), 400
        
        # Verificar que la cuenta pertenezca al usuario
        cuenta = Cuenta.obtener_cuenta_por_numero(data['numero_cuenta'])
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado para usar esta cuenta'}), 403
        
        # Crear transacción
        transaccion, error = Transaccion.crear_transaccion(
            numero_cuenta_origen=data['numero_cuenta'],
            tipo='retiro',
            monto=float(data['monto']),
            descripcion=data.get('descripcion', 'Retiro')
        )
        
        if error:
            return jsonify({'message': error}), 400
        
        return jsonify({
            'message': 'Retiro realizado exitosamente',
            'transaction': transaccion
        }), 201
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/stats', methods=['GET'])
def get_transactions_stats():
    """Obtiene estadísticas de transacciones del usuario"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Calcular estadísticas
        total_depositos = sum(float(t['monto']) for t in transacciones if t['tipo_transaccion'] == 'deposito')
        total_retiros = sum(float(t['monto']) for t in transacciones if t['tipo_transaccion'] == 'retiro')
        total_transferencias = sum(float(t['monto']) for t in transacciones if t['tipo_transaccion'] == 'transferencia')
        
        return jsonify({
            'total_transactions': len(transacciones),
            'total_deposits': round(total_depositos, 2),
            'total_withdrawals': round(total_retiros, 2),
            'total_transfers': round(total_transferencias, 2),
            'count_deposits': sum(1 for t in transacciones if t['tipo_transaccion'] == 'deposito'),
            'count_withdrawals': sum(1 for t in transacciones if t['tipo_transaccion'] == 'retiro'),
            'count_transfers': sum(1 for t in transacciones if t['tipo_transaccion'] == 'transferencia')
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@transactions_bp.route('/by-account/<numero_cuenta>', methods=['GET'])
def get_transactions_by_account(numero_cuenta):
    """Obtiene todas las transacciones de una cuenta específica"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Verificar que la cuenta pertenezca al usuario
        cuenta = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        # Obtener transacciones de la cuenta
        from utils.file_manager import read_json
        todas_transacciones = read_json('transacciones.json')
        transacciones_cuenta = [
            t for t in todas_transacciones 
            if t['numero_cuenta_origen'] == numero_cuenta or t.get('numero_cuenta_destino') == numero_cuenta
        ]
        
        # Ordenar por fecha descendente
        transacciones_cuenta.sort(key=lambda x: x['fecha_hora'], reverse=True)
        
        return jsonify({
            'transactions': transacciones_cuenta,
            'total': len(transacciones_cuenta)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500
