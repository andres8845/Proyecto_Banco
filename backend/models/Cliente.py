from datetime import datetime
from utils.file_manager import (
    read_json, add_item, find_by_field, get_next_id
)
from utils.auth import hash_password

class Cliente:
    def __init__(self, nombre, apellido, dni, direccion, telefono, email, password):
        self.nombre = nombre
        self.apellido = apellido
        self.dni = dni
        self.direccion = direccion
        self.telefono = telefono
        self.email = email
        self.password = password
    
    @staticmethod
    def crear_cliente(nombre, apellido, dni, direccion, telefono, email, password):
        """Crea un nuevo cliente en el sistema"""
        # Verificar si el email ya existe
        if find_by_field('clientes.json', 'email', email):
            return None, "El email ya está registrado"
        
        # Verificar si el DNI ya existe
        if find_by_field('clientes.json', 'dni', dni):
            return None, "El DNI ya está registrado"
        
        # Crear cliente
        cliente_data = {
            'id_cliente': get_next_id('clientes.json', 'id_cliente'),
            'nombre': nombre,
            'apellido': apellido,
            'dni': dni,
            'direccion': direccion,
            'telefono': telefono,
            'email': email,
            'password': hash_password(password),
            'fecha_registro': datetime.now().isoformat()
        }
        
        add_item('clientes.json', cliente_data)
        
        # Remover password antes de retornar
        cliente_data_safe = {k: v for k, v in cliente_data.items() if k != 'password'}
        return cliente_data_safe, None
    
    @staticmethod
    def obtener_cliente_por_email(email):
        """Obtiene un cliente por su email"""
        return find_by_field('clientes.json', 'email', email)
    
    @staticmethod
    def obtener_cliente_por_id(id_cliente):
        """Obtiene un cliente por su ID"""
        clientes = read_json('clientes.json')
        for cliente in clientes:
            if cliente['id_cliente'] == id_cliente:
                # Remover password antes de retornar
                return {k: v for k, v in cliente.items() if k != 'password'}
        return None
    
    @staticmethod
    def obtener_todos_clientes():
        """Obtiene todos los clientes (sin passwords)"""
        clientes = read_json('clientes.json')
        return [{k: v for k, v in c.items() if k != 'password'} for c in clientes]
