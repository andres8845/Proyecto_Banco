from flask import Blueprint, request, jsonify
from models.Cuenta import Cuenta, CuentaAhorro, CuentaCorriente
from models.Transaccion import Transaccion
from utils.auth import decode_token
from utils.file_manager import read_json, write_json

operations_bp = Blueprint('operations', __name__)

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

@operations_bp.route('/calculate-interest', methods=['POST'])
def calculate_interest():
    """Calcula y aplica intereses a una cuenta de ahorro"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        numero_cuenta = data.get('numero_cuenta')
        
        if not numero_cuenta:
            return jsonify({'message': 'Número de cuenta requerido'}), 400
        
        # Obtener cuenta
        cuenta_data = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        if not cuenta_data:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        # Verificar que pertenezca al usuario
        if cuenta_data['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        # Verificar que sea cuenta de ahorro
        if cuenta_data['tipo_cuenta'] != 'ahorro':
            return jsonify({'message': 'Solo las cuentas de ahorro generan intereses'}), 400
        
        # Crear objeto cuenta de ahorro
        cuenta_ahorro = CuentaAhorro(
            id_cuenta=cuenta_data['id_cuenta'],
            id_cliente=cuenta_data['id_cliente'],
            numero_cuenta=cuenta_data['numero_cuenta'],
            saldo=cuenta_data['saldo'],
            tasa_interes=cuenta_data.get('tasa_interes', 3.5),
            limite_retiros=cuenta_data.get('limite_retiros', 5)
        )
        
        # Calcular interés
        interes = cuenta_ahorro.calcular_interes()
        
        # Actualizar en archivo
        cuentas = read_json('cuentas.json')
        for i, c in enumerate(cuentas):
            if c['numero_cuenta'] == numero_cuenta:
                cuentas[i]['saldo'] = cuenta_ahorro.saldo
                write_json('cuentas.json', cuentas)
                break
        
        # Registrar como transacción
        from utils.file_manager import add_item, get_next_id
        transaccion_data = {
            'id_transaccion': get_next_id('transacciones.json', 'id_transaccion'),
            'numero_cuenta_origen': numero_cuenta,
            'numero_cuenta_destino': None,
            'tipo_transaccion': 'interes',
            'monto': float(interes),
            'fecha_hora': cuenta_ahorro.fecha_apertura,
            'descripcion': 'Interés mensual aplicado',
            'estado': 'completada'
        }
        add_item('transacciones.json', transaccion_data)
        
        return jsonify({
            'message': 'Interés calculado y aplicado exitosamente',
            'interes': round(interes, 2),
            'nuevo_saldo': round(cuenta_ahorro.saldo, 2)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@operations_bp.route('/reset-withdrawal-limit', methods=['POST'])
def reset_withdrawal_limit():
    """Reinicia el límite de retiros de una cuenta de ahorro"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        numero_cuenta = data.get('numero_cuenta')
        
        if not numero_cuenta:
            return jsonify({'message': 'Número de cuenta requerido'}), 400
        
        # Obtener cuenta
        cuenta_data = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        if not cuenta_data:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        # Verificar que pertenezca al usuario
        if cuenta_data['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        # Verificar que sea cuenta de ahorro
        if cuenta_data['tipo_cuenta'] != 'ahorro':
            return jsonify({'message': 'Solo las cuentas de ahorro tienen límite de retiros'}), 400
        
        # Actualizar límite
        cuentas = read_json('cuentas.json')
        for i, c in enumerate(cuentas):
            if c['numero_cuenta'] == numero_cuenta:
                cuentas[i]['retiros_realizados'] = 0
                write_json('cuentas.json', cuentas)
                break
        
        return jsonify({
            'message': 'Límite de retiros reiniciado exitosamente'
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@operations_bp.route('/overdraft-status/<numero_cuenta>', methods=['GET'])
def check_overdraft(numero_cuenta):
    """Verifica el estado de sobregiro de una cuenta corriente"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Obtener cuenta
        cuenta_data = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        if not cuenta_data:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        # Verificar que pertenezca al usuario
        if cuenta_data['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado'}), 403
        
        # Verificar que sea cuenta corriente
        if cuenta_data['tipo_cuenta'] != 'corriente':
            return jsonify({'message': 'Solo las cuentas corrientes tienen sobregiro'}), 400
        
        # Crear objeto cuenta corriente
        cuenta_corriente = CuentaCorriente(
            id_cuenta=cuenta_data['id_cuenta'],
            id_cliente=cuenta_data['id_cliente'],
            numero_cuenta=cuenta_data['numero_cuenta'],
            saldo=cuenta_data['saldo'],
            limite_descubierto=cuenta_data.get('limite_descubierto', 0.00)
        )
        
        tiene_sobregiro = cuenta_corriente.tiene_sobregiro()
        monto_sobregiro = cuenta_corriente.obtener_monto_sobregiro()
        
        return jsonify({
            'tiene_sobregiro': tiene_sobregiro,
            'monto_sobregiro': round(monto_sobregiro, 2),
            'saldo_actual': round(cuenta_corriente.saldo, 2),
            'limite_descubierto': round(cuenta_corriente.limite_descubierto, 2),
            'saldo_disponible': round(cuenta_corriente.saldo + cuenta_corriente.limite_descubierto, 2)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500
