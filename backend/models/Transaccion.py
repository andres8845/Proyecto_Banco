from datetime import datetime
from utils.file_manager import (
    read_json, add_item, get_next_id, write_json
)
from models.Cuenta import Cuenta, CuentaAhorro, CuentaCorriente

class Transaccion:
    def __init__(self, id_cuenta_origen, tipo, monto, id_cuenta_destino=None, descripcion=""):
        self.id_cuenta_origen = id_cuenta_origen
        self.id_cuenta_destino = id_cuenta_destino
        self.tipo = tipo
        self.monto = monto
        self.descripcion = descripcion
    
    @staticmethod
    def _cargar_cuenta_objeto(cuenta_data):
        """Convierte datos de cuenta JSON a objeto de clase correspondiente"""
        if cuenta_data['tipo_cuenta'] == 'ahorro':
            return CuentaAhorro(
                id_cuenta=cuenta_data['id_cuenta'],
                id_cliente=cuenta_data['id_cliente'],
                numero_cuenta=cuenta_data['numero_cuenta'],
                saldo=cuenta_data['saldo'],
                tasa_interes=cuenta_data.get('tasa_interes', 3.5),
                limite_retiros=cuenta_data.get('limite_retiros', 5)
            )
        elif cuenta_data['tipo_cuenta'] == 'corriente':
            return CuentaCorriente(
                id_cuenta=cuenta_data['id_cuenta'],
                id_cliente=cuenta_data['id_cliente'],
                numero_cuenta=cuenta_data['numero_cuenta'],
                saldo=cuenta_data['saldo'],
                limite_descubierto=cuenta_data.get('limite_descubierto', 0.00)
            )
        return None
    
    @staticmethod
    def _guardar_cuenta(cuenta_obj, cuenta_data_original):
        """Guarda los cambios de un objeto cuenta en el archivo JSON"""
        cuentas = read_json('cuentas.json')
        for i, c in enumerate(cuentas):
            if c['numero_cuenta'] == cuenta_obj.numero_cuenta:
                # Mantener campos específicos del tipo de cuenta
                cuentas[i]['saldo'] = cuenta_obj.saldo
                
                if isinstance(cuenta_obj, CuentaAhorro):
                    cuentas[i]['retiros_realizados'] = cuenta_obj.retiros_realizados
                
                write_json('cuentas.json', cuentas)
                return cuentas[i]
        return None
    
    @staticmethod
    def crear_transaccion(numero_cuenta_origen, tipo, monto, numero_cuenta_destino=None, descripcion=""):
        """Crea una nueva transacción usando las clases de cuenta"""
        # Validar tipo de transacción
        if tipo not in ['deposito', 'retiro', 'transferencia']:
            return None, "Tipo de transacción inválido"
        
        # Validar monto
        if monto <= 0:
            return None, "El monto debe ser mayor a 0"
        
        # Obtener cuenta origen
        cuenta_origen_data = Cuenta.obtener_cuenta_por_numero(numero_cuenta_origen)
        if not cuenta_origen_data:
            return None, "Cuenta origen no encontrada"
        
        # Cargar objeto cuenta origen
        cuenta_origen = Transaccion._cargar_cuenta_objeto(cuenta_origen_data)
        if not cuenta_origen:
            return None, "Error al cargar cuenta origen"
        
        # Procesar según tipo de transacción
        if tipo == 'deposito':
            exito, mensaje = cuenta_origen.depositar(monto)
            if not exito:
                return None, mensaje
            
            Transaccion._guardar_cuenta(cuenta_origen, cuenta_origen_data)
        
        elif tipo == 'retiro':
            exito, mensaje = cuenta_origen.retirar(monto)
            if not exito:
                return None, mensaje
            
            Transaccion._guardar_cuenta(cuenta_origen, cuenta_origen_data)
        
        elif tipo == 'transferencia':
            if not numero_cuenta_destino:
                return None, "Se requiere cuenta destino para transferencia"
            
            cuenta_destino_data = Cuenta.obtener_cuenta_por_numero(numero_cuenta_destino)
            if not cuenta_destino_data:
                return None, "Cuenta destino no encontrada"
            
            # Cargar objeto cuenta destino
            cuenta_destino = Transaccion._cargar_cuenta_objeto(cuenta_destino_data)
            if not cuenta_destino:
                return None, "Error al cargar cuenta destino"
            
            # Intentar retirar de cuenta origen
            exito, mensaje = cuenta_origen.retirar(monto)
            if not exito:
                return None, mensaje
            
            # Depositar en cuenta destino
            exito_deposito, mensaje_deposito = cuenta_destino.depositar(monto)
            if not exito_deposito:
                # Revertir retiro
                cuenta_origen.depositar(monto)
                return None, f"Error al depositar en cuenta destino: {mensaje_deposito}"
            
            # Guardar ambas cuentas
            Transaccion._guardar_cuenta(cuenta_origen, cuenta_origen_data)
            Transaccion._guardar_cuenta(cuenta_destino, cuenta_destino_data)
        
        # Crear registro de transacción
        transaccion_data = {
            'id_transaccion': get_next_id('transacciones.json', 'id_transaccion'),
            'numero_cuenta_origen': numero_cuenta_origen,
            'numero_cuenta_destino': numero_cuenta_destino,
            'tipo_transaccion': tipo,
            'monto': float(monto),
            'fecha_hora': datetime.now().isoformat(),
            'descripcion': descripcion,
            'estado': 'completada'
        }
        
        add_item('transacciones.json', transaccion_data)
        return transaccion_data, None
    
    @staticmethod
    def obtener_transacciones_por_cuenta(numero_cuenta):
        """Obtiene todas las transacciones de una cuenta"""
        transacciones = read_json('transacciones.json')
        return [
            t for t in transacciones 
            if t['numero_cuenta_origen'] == numero_cuenta or 
               t.get('numero_cuenta_destino') == numero_cuenta
        ]
    
    @staticmethod
    def obtener_transacciones_por_cliente(id_cliente):
        """Obtiene todas las transacciones de un cliente"""
        # Obtener cuentas del cliente
        cuentas = Cuenta.obtener_cuentas_por_cliente(id_cliente)
        numeros_cuenta = [c['numero_cuenta'] for c in cuentas]
        
        # Obtener transacciones
        transacciones = read_json('transacciones.json')
        return [
            t for t in transacciones 
            if t['numero_cuenta_origen'] in numeros_cuenta or 
               t.get('numero_cuenta_destino') in numeros_cuenta
        ]
    
    @staticmethod
    def obtener_todas_transacciones():
        """Obtiene todas las transacciones del sistema"""
        return read_json('transacciones.json')
