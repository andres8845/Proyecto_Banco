from datetime import datetime
import random
from abc import ABC, abstractmethod
from utils.file_manager import (
    read_json, add_item, find_by_id, get_next_id, update_item, write_json
)

class Cuenta(ABC):
    """Clase abstracta base para todas las cuentas bancarias"""
    
    def __init__(self, id_cuenta, id_cliente, numero_cuenta, saldo=0.00):
        self.id_cuenta = id_cuenta
        self.id_cliente = id_cliente
        self.numero_cuenta = numero_cuenta
        self.saldo = saldo
        self.fecha_apertura = datetime.now().isoformat()
        self.estado = 'activa'
    
    @abstractmethod
    def depositar(self, monto):
        """Método abstracto para realizar depósitos"""
        pass
    
    @abstractmethod
    def retirar(self, monto):
        """Método abstracto para realizar retiros"""
        pass
    
    def consultar_saldo(self):
        """Consulta el saldo actual de la cuenta"""
        return self.saldo
    
    @staticmethod
    def generar_numero_cuenta():
        """Genera un número de cuenta único de 16 dígitos"""
        return ''.join([str(random.randint(0, 9)) for _ in range(16)])
    
    @staticmethod
    def crear_cuenta(id_cliente, tipo_cuenta, saldo_inicial=0.00, **kwargs):
        """Crea una nueva cuenta bancaria según el tipo"""
        # Validar tipo de cuenta
        if tipo_cuenta not in ['ahorro', 'corriente']:
            return None, "Tipo de cuenta inválido. Use 'ahorro' o 'corriente'"
        
        # Validar saldo inicial
        if saldo_inicial < 0:
            return None, "El saldo inicial no puede ser negativo"
        
        # Generar número de cuenta único
        numero_cuenta = Cuenta.generar_numero_cuenta()
        while find_by_id('cuentas.json', numero_cuenta, 'numero_cuenta'):
            numero_cuenta = Cuenta.generar_numero_cuenta()
        
        id_cuenta = get_next_id('cuentas.json', 'id_cuenta')
        
        # Crear cuenta según tipo
        if tipo_cuenta == 'ahorro':
            tasa_interes = kwargs.get('tasa_interes', 3.5)
            limite_retiros = kwargs.get('limite_retiros', 5)
            cuenta_data = {
                'id_cuenta': id_cuenta,
                'id_cliente': id_cliente,
                'numero_cuenta': numero_cuenta,
                'tipo_cuenta': tipo_cuenta,
                'saldo': float(saldo_inicial),
                'fecha_apertura': datetime.now().isoformat(),
                'estado': 'activa',
                'tasa_interes': float(tasa_interes),
                'limite_retiros': int(limite_retiros),
                'retiros_realizados': 0
            }
        else:  # corriente
            limite_descubierto = kwargs.get('limite_descubierto', 0.00)
            cuenta_data = {
                'id_cuenta': id_cuenta,
                'id_cliente': id_cliente,
                'numero_cuenta': numero_cuenta,
                'tipo_cuenta': tipo_cuenta,
                'saldo': float(saldo_inicial),
                'fecha_apertura': datetime.now().isoformat(),
                'estado': 'activa',
                'limite_descubierto': float(limite_descubierto)
            }
        
        add_item('cuentas.json', cuenta_data)
        return cuenta_data, None
    
    @staticmethod
    def obtener_cuentas_por_cliente(id_cliente):
        """Obtiene todas las cuentas de un cliente"""
        cuentas = read_json('cuentas.json')
        return [c for c in cuentas if c['id_cliente'] == id_cliente]
    
    @staticmethod
    def obtener_cuenta_por_numero(numero_cuenta):
        """Obtiene una cuenta por su número"""
        cuentas = read_json('cuentas.json')
        for cuenta in cuentas:
            if cuenta['numero_cuenta'] == numero_cuenta:
                return cuenta
        return None
    
    @staticmethod
    def obtener_cuenta_por_id(id_cuenta):
        """Obtiene una cuenta por su ID"""
        cuentas = read_json('cuentas.json')
        for cuenta in cuentas:
            if cuenta['id_cuenta'] == id_cuenta:
                return cuenta
        return None
    
    @staticmethod
    def actualizar_saldo(numero_cuenta, nuevo_saldo):
        """Actualiza el saldo de una cuenta"""
        cuenta = Cuenta.obtener_cuenta_por_numero(numero_cuenta)
        if not cuenta:
            return None, "Cuenta no encontrada"
        
        cuentas = read_json('cuentas.json')
        for i, c in enumerate(cuentas):
            if c['numero_cuenta'] == numero_cuenta:
                cuentas[i]['saldo'] = float(nuevo_saldo)
                from utils.file_manager import write_json
                write_json('cuentas.json', cuentas)
                return cuentas[i], None
        
        return None, "Error al actualizar saldo"
    
    @staticmethod
    def obtener_todas_cuentas():
        """Obtiene todas las cuentas del sistema"""
        return read_json('cuentas.json')


class CuentaAhorro(Cuenta):
    """Clase para cuentas de ahorro con tasa de interés y límite de retiros"""
    
    def __init__(self, id_cuenta, id_cliente, numero_cuenta, saldo=0.00, tasa_interes=3.5, limite_retiros=5):
        super().__init__(id_cuenta, id_cliente, numero_cuenta, saldo)
        self.tasa_interes = tasa_interes
        self.limite_retiros = limite_retiros
        self.retiros_realizados = 0
    
    def depositar(self, monto):
        """Realiza un depósito en la cuenta de ahorro"""
        if monto <= 0:
            return False, "El monto debe ser mayor a 0"
        
        self.saldo += monto
        return True, f"Depósito de {monto} realizado exitosamente"
    
    def retirar(self, monto):
        """Realiza un retiro con validación de límite de retiros"""
        if monto <= 0:
            return False, "El monto debe ser mayor a 0"
        
        if self.retiros_realizados >= self.limite_retiros:
            return False, f"Ha alcanzado el límite de {self.limite_retiros} retiros para este período"
        
        if self.saldo < monto:
            return False, "Saldo insuficiente"
        
        self.saldo -= monto
        self.retiros_realizados += 1
        return True, f"Retiro de {monto} realizado exitosamente"
    
    def calcular_interes(self):
        """Calcula y aplica el interés mensual a la cuenta"""
        interes = self.saldo * (self.tasa_interes / 100) / 12
        self.saldo += interes
        return interes
    
    def reiniciar_limite_retiros(self):
        """Reinicia el contador de retiros (debe llamarse mensualmente)"""
        self.retiros_realizados = 0


class CuentaCorriente(Cuenta):
    """Clase para cuentas corrientes con posibilidad de sobregiro"""
    
    def __init__(self, id_cuenta, id_cliente, numero_cuenta, saldo=0.00, limite_descubierto=0.00):
        super().__init__(id_cuenta, id_cliente, numero_cuenta, saldo)
        self.limite_descubierto = limite_descubierto
    
    def depositar(self, monto):
        """Realiza un depósito en la cuenta corriente"""
        if monto <= 0:
            return False, "El monto debe ser mayor a 0"
        
        self.saldo += monto
        return True, f"Depósito de {monto} realizado exitosamente"
    
    def retirar(self, monto):
        """Realiza un retiro con posibilidad de sobregiro"""
        if monto <= 0:
            return False, "El monto debe ser mayor a 0"
        
        saldo_disponible = self.saldo + self.limite_descubierto
        
        if saldo_disponible < monto:
            return False, f"Saldo insuficiente. Saldo disponible (incluido sobregiro): {saldo_disponible}"
        
        self.saldo -= monto
        return True, f"Retiro de {monto} realizado exitosamente"
    
    def tiene_sobregiro(self):
        """Verifica si la cuenta está en sobregiro"""
        return self.saldo < 0
    
    def obtener_monto_sobregiro(self):
        """Obtiene el monto actual de sobregiro"""
        return abs(self.saldo) if self.saldo < 0 else 0
