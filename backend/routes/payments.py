from flask import Blueprint, request, jsonify
from models.Cuenta import Cuenta
from models.Transaccion import Transaccion
from utils.auth import decode_token
from utils.file_manager import add_item, get_next_id
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

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

@payments_bp.route('/process', methods=['POST'])
def process_payment():
    """Procesa un pago de servicio o factura"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['numero_cuenta', 'monto', 'service_type', 'reference']
        for field in required_fields:
            if field not in data:
                return jsonify({'message': f'El campo {field} es requerido'}), 400
        
        # Verificar que la cuenta pertenezca al usuario
        cuenta = Cuenta.obtener_cuenta_por_numero(data['numero_cuenta'])
        if not cuenta:
            return jsonify({'message': 'Cuenta no encontrada'}), 404
        
        if cuenta['id_cliente'] != user_id:
            return jsonify({'message': 'No autorizado para usar esta cuenta'}), 403
        
        # Verificar saldo suficiente
        monto = float(data['monto'])
        if float(cuenta['saldo']) < monto:
            return jsonify({'message': 'Saldo insuficiente'}), 400
        
        # Crear descripción del pago
        service_type = data['service_type']
        reference = data['reference']
        descripcion = f"Pago de {service_type} - Ref: {reference}"
        if 'notes' in data and data['notes']:
            descripcion += f" - {data['notes']}"
        
        # Crear transacción de pago (tipo retiro con descripción especial)
        transaccion, error = Transaccion.crear_transaccion(
            numero_cuenta_origen=data['numero_cuenta'],
            tipo='retiro',
            monto=monto,
            descripcion=descripcion
        )
        
        if error:
            return jsonify({'message': error}), 400
        
        # Agregar información adicional a la respuesta
        transaccion['payment_type'] = service_type
        transaccion['reference'] = reference
        
        return jsonify({
            'message': 'Pago procesado exitosamente',
            'transaction': transaccion
        }), 201
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@payments_bp.route('/history', methods=['GET'])
def get_payment_history():
    """Obtiene el historial de pagos del usuario"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Obtener todas las transacciones del usuario
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Filtrar solo las que parecen pagos (retiros con "Pago" en la descripción)
        pagos = [
            t for t in transacciones
            if t['tipo_transaccion'] == 'retiro' and 'Pago' in t.get('descripcion', '')
        ]
        
        # Ordenar por fecha descendente
        pagos.sort(key=lambda x: x['fecha_hora'], reverse=True)
        
        return jsonify({
            'payments': pagos,
            'total': len(pagos)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@payments_bp.route('/categories', methods=['GET'])
def get_payment_categories():
    """Obtiene las categorías de pago disponibles"""
    categories = [
        {
            'id': 'utility',
            'name': 'Servicios Básicos',
            'services': [
                {'id': 'electricity', 'name': 'Electricidad'},
                {'id': 'water', 'name': 'Agua'},
                {'id': 'gas', 'name': 'Gas'}
            ]
        },
        {
            'id': 'telecom',
            'name': 'Telecomunicaciones',
            'services': [
                {'id': 'mobile', 'name': 'Teléfono Móvil'},
                {'id': 'internet', 'name': 'Internet'},
                {'id': 'cable', 'name': 'TV por Cable'}
            ]
        },
        {
            'id': 'education',
            'name': 'Educación',
            'services': [
                {'id': 'school', 'name': 'Colegiatura'},
                {'id': 'university', 'name': 'Universidad'},
                {'id': 'courses', 'name': 'Cursos'}
            ]
        },
        {
            'id': 'insurance',
            'name': 'Seguros',
            'services': [
                {'id': 'health', 'name': 'Seguro de Salud'},
                {'id': 'car', 'name': 'Seguro de Auto'},
                {'id': 'life', 'name': 'Seguro de Vida'}
            ]
        }
    ]
    
    return jsonify({'categories': categories}), 200
