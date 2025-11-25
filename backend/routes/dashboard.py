from flask import Blueprint, request, jsonify
from models.Cuenta import Cuenta
from models.Transaccion import Transaccion
from models.Cliente import Cliente
from utils.auth import decode_token
from datetime import datetime, timedelta
from collections import defaultdict

dashboard_bp = Blueprint('dashboard', __name__)

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

@dashboard_bp.route('/stats', methods=['GET'])
def get_dashboard_stats():
    """Obtiene estadísticas generales del dashboard"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Obtener cuentas
        cuentas = Cuenta.obtener_cuentas_por_cliente(user_id)
        
        # Obtener transacciones
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Calcular balance total
        total_balance = sum(float(c.get('saldo', 0)) for c in cuentas)
        
        # Calcular ingresos y gastos del mes actual
        now = datetime.now()
        primer_dia_mes = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        ingresos_mes = 0
        gastos_mes = 0
        
        for t in transacciones:
            try:
                fecha_trans = datetime.fromisoformat(t['fecha_hora'].replace('Z', '+00:00'))
                if fecha_trans >= primer_dia_mes:
                    monto = float(t['monto'])
                    if t['tipo_transaccion'] == 'deposito':
                        ingresos_mes += monto
                    elif t['tipo_transaccion'] in ['retiro', 'transferencia']:
                        gastos_mes += monto
            except:
                continue
        
        # Transacciones recientes (últimas 5)
        transacciones_ordenadas = sorted(transacciones, key=lambda x: x['fecha_hora'], reverse=True)
        transacciones_recientes = transacciones_ordenadas[:5]
        
        return jsonify({
            'total_balance': round(total_balance, 2),
            'total_accounts': len(cuentas),
            'monthly_income': round(ingresos_mes, 2),
            'monthly_expenses': round(gastos_mes, 2),
            'recent_transactions': transacciones_recientes,
            'active_accounts': sum(1 for c in cuentas if c.get('estado') == 'activa')
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@dashboard_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Obtiene análisis detallado de transacciones para gráficas"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Obtener parámetro de período (week, month, quarter, year)
        period = request.args.get('period', 'month')
        
        # Obtener transacciones
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Calcular fecha inicial según el período
        now = datetime.now()
        if period == 'week':
            fecha_inicio = now - timedelta(days=7)
        elif period == 'month':
            fecha_inicio = now - timedelta(days=30)
        elif period == 'quarter':
            fecha_inicio = now - timedelta(days=90)
        elif period == 'year':
            fecha_inicio = now - timedelta(days=365)
        else:
            fecha_inicio = now - timedelta(days=30)
        
        # Filtrar transacciones por período
        transacciones_periodo = []
        for t in transacciones:
            try:
                fecha_trans = datetime.fromisoformat(t['fecha_hora'].replace('Z', '+00:00'))
                if fecha_trans >= fecha_inicio:
                    transacciones_periodo.append(t)
            except:
                continue
        
        # Análisis por tipo de transacción
        depositos = sum(float(t['monto']) for t in transacciones_periodo if t['tipo_transaccion'] == 'deposito')
        retiros = sum(float(t['monto']) for t in transacciones_periodo if t['tipo_transaccion'] == 'retiro')
        transferencias = sum(float(t['monto']) for t in transacciones_periodo if t['tipo_transaccion'] == 'transferencia')
        
        # Análisis por categoría (basado en descripción)
        categorias = defaultdict(float)
        for t in transacciones_periodo:
            descripcion = t.get('descripcion', '').lower()
            if any(word in descripcion for word in ['compra', 'shopping', 'tienda']):
                categorias['Compras'] += float(t['monto'])
            elif any(word in descripcion for word in ['comida', 'restaurant', 'alimento', 'comida']):
                categorias['Alimentos'] += float(t['monto'])
            elif any(word in descripcion for word in ['renta', 'casa', 'vivienda', 'alquiler']):
                categorias['Vivienda'] += float(t['monto'])
            elif any(word in descripcion for word in ['transporte', 'taxi', 'uber', 'gasolina']):
                categorias['Transporte'] += float(t['monto'])
            elif any(word in descripcion for word in ['tecnología', 'tech', 'tecnologia', 'electrónica']):
                categorias['Tecnología'] += float(t['monto'])
            elif any(word in descripcion for word in ['salud', 'medico', 'farmacia', 'hospital']):
                categorias['Salud'] += float(t['monto'])
            else:
                categorias['Otros'] += float(t['monto'])
        
        # Convertir categorías a lista
        categoria_data = [
            {'name': k, 'value': round(v, 2)} 
            for k, v in categorias.items()
        ]
        
        # Tendencia mensual (últimos 6 meses)
        tendencia_mensual = []
        for i in range(6, 0, -1):
            mes_inicio = (now - timedelta(days=30*i)).replace(day=1)
            mes_fin = (now - timedelta(days=30*(i-1))).replace(day=1)
            
            ingresos = sum(
                float(t['monto']) for t in transacciones
                if t['tipo_transaccion'] == 'deposito' and
                mes_inicio <= datetime.fromisoformat(t['fecha_hora'].replace('Z', '+00:00')) < mes_fin
            )
            gastos = sum(
                float(t['monto']) for t in transacciones
                if t['tipo_transaccion'] in ['retiro', 'transferencia'] and
                mes_inicio <= datetime.fromisoformat(t['fecha_hora'].replace('Z', '+00:00')) < mes_fin
            )
            
            tendencia_mensual.append({
                'month': mes_inicio.strftime('%b'),
                'ingresos': round(ingresos, 2),
                'gastos': round(gastos, 2)
            })
        
        return jsonify({
            'period': period,
            'total_deposits': round(depositos, 2),
            'total_withdrawals': round(retiros, 2),
            'total_transfers': round(transferencias, 2),
            'categories': categoria_data,
            'monthly_trend': tendencia_mensual,
            'total_transactions': len(transacciones_periodo)
        }), 200
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500

@dashboard_bp.route('/summary', methods=['GET'])
def get_summary():
    """Obtiene un resumen completo del estado financiero del usuario"""
    try:
        user_id = get_user_id_from_token()
        if not user_id:
            return jsonify({'message': 'No autenticado'}), 401
        
        # Obtener información del usuario
        cliente = Cliente.obtener_cliente_por_id(user_id)
        if not cliente:
            return jsonify({'message': 'Usuario no encontrado'}), 404
        
        # Obtener cuentas
        cuentas = Cuenta.obtener_cuentas_por_cliente(user_id)
        
        # Obtener transacciones
        transacciones = Transaccion.obtener_transacciones_por_cliente(user_id)
        
        # Calcular totales
        total_balance = sum(float(c.get('saldo', 0)) for c in cuentas)
        total_ahorro = sum(float(c.get('saldo', 0)) for c in cuentas if c.get('tipo_cuenta') == 'ahorro')
        total_corriente = sum(float(c.get('saldo', 0)) for c in cuentas if c.get('tipo_cuenta') == 'corriente')
        
        # Transacciones del último mes
        now = datetime.now()
        hace_un_mes = now - timedelta(days=30)
        transacciones_mes = [
            t for t in transacciones
            if datetime.fromisoformat(t['fecha_hora'].replace('Z', '+00:00')) >= hace_un_mes
        ]
        
        return jsonify({
            'user': {
                'id': cliente['id_cliente'],
                'nombre': f"{cliente['nombre']} {cliente['apellido']}",
                'email': cliente['email']
            },
            'accounts_summary': {
                'total_balance': round(total_balance, 2),
                'savings_balance': round(total_ahorro, 2),
                'checking_balance': round(total_corriente, 2),
                'total_accounts': len(cuentas)
            },
            'transactions_summary': {
                'total_transactions': len(transacciones),
                'monthly_transactions': len(transacciones_mes)
            }
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Error en el servidor: {str(e)}'}), 500
