# Arquitectura POO - Sistema Bancario

## 📐 Diseño Orientado a Objetos

Este sistema bancario implementa los principios de Programación Orientada a Objetos (POO):

### 🏛️ Clases Principales

#### 1. **Cuenta (Clase Abstracta)**
```python
class Cuenta(ABC):
    - id_cuenta
    - id_cliente
    - numero_cuenta
    - saldo
    - fecha_apertura
    - estado
    
    Métodos abstractos:
    - depositar(monto)
    - retirar(monto)
    
    Métodos concretos:
    - consultar_saldo()
    - generar_numero_cuenta()
    - crear_cuenta()
```

La clase `Cuenta` es **abstracta** (usando ABC - Abstract Base Class), lo que significa que:
- No se puede instanciar directamente
- Define la estructura común para todas las cuentas
- Obliga a las clases hijas a implementar `depositar()` y `retirar()`

#### 2. **CuentaAhorro (Hereda de Cuenta)**
```python
class CuentaAhorro(Cuenta):
    Atributos adicionales:
    - tasa_interes (default: 3.5%)
    - limite_retiros (default: 5)
    - retiros_realizados
    
    Métodos implementados:
    - depositar(monto) ✓
    - retirar(monto) ✓ (con validación de límite)
    
    Métodos específicos:
    - calcular_interes()
    - reiniciar_limite_retiros()
```

**Características:**
- ✅ Genera **intereses mensuales** sobre el saldo
- ⚠️ Tiene un **límite de retiros** mensuales
- 💰 Ideal para ahorro a largo plazo

#### 3. **CuentaCorriente (Hereda de Cuenta)**
```python
class CuentaCorriente(Cuenta):
    Atributos adicionales:
    - limite_descubierto (sobregiro permitido)
    
    Métodos implementados:
    - depositar(monto) ✓
    - retirar(monto) ✓ (con sobregiro permitido)
    
    Métodos específicos:
    - tiene_sobregiro()
    - obtener_monto_sobregiro()
```

**Características:**
- ✅ Permite **sobregiro** (saldo negativo hasta el límite)
- ⚠️ Sin límite de retiros
- 💳 Ideal para movimientos frecuentes

#### 4. **Cliente**
```python
class Cliente:
    - id_cliente
    - nombre
    - apellido
    - dni (único)
    - direccion
    - telefono
    - email (único)
    - password (hasheado)
    - fecha_registro
    
    Métodos estáticos:
    - crear_cliente()
    - obtener_cliente_por_email()
    - obtener_cliente_por_id()
```

#### 5. **Transaccion**
```python
class Transaccion:
    - id_transaccion
    - numero_cuenta_origen
    - numero_cuenta_destino (opcional)
    - tipo_transaccion (deposito, retiro, transferencia)
    - monto
    - fecha_hora
    - descripcion
    - estado
    
    Métodos:
    - crear_transaccion()
    - obtener_transacciones_por_cuenta()
    - obtener_transacciones_por_cliente()
```

## 🔄 Polimorfismo en Acción

El sistema utiliza **polimorfismo** para manejar diferentes tipos de cuentas:

```python
# La clase Transaccion trabaja con cualquier tipo de cuenta
cuenta = _cargar_cuenta_objeto(cuenta_data)

# Polimorfismo: el método retirar() se comporta diferente según el tipo
if isinstance(cuenta, CuentaAhorro):
    # Valida límite de retiros
    exito, mensaje = cuenta.retirar(monto)
elif isinstance(cuenta, CuentaCorriente):
    # Permite sobregiro
    exito, mensaje = cuenta.retirar(monto)
```

## 🎯 Operaciones Implementadas

### 1. Depósito
```python
cuenta.depositar(monto)
# Comportamiento igual para ambos tipos de cuenta
# - Valida monto > 0
# - Aumenta el saldo
```

### 2. Retiro
```python
# CuentaAhorro
cuenta_ahorro.retirar(monto)
# - Valida monto > 0
# - Valida saldo suficiente
# - Valida límite de retiros no alcanzado
# - Incrementa contador de retiros

# CuentaCorriente
cuenta_corriente.retirar(monto)
# - Valida monto > 0
# - Permite usar sobregiro (saldo + limite_descubierto)
# - Sin límite de retiros
```

### 3. Transferencia
```python
Transaccion.crear_transaccion(
    numero_cuenta_origen,
    'transferencia',
    monto,
    numero_cuenta_destino
)
# - Retira de cuenta origen (usando su lógica específica)
# - Deposita en cuenta destino (usando su lógica específica)
# - Registra la transacción
```

### 4. Cálculo de Intereses
```python
# Solo para CuentaAhorro
cuenta_ahorro.calcular_interes()
# - Calcula: saldo * (tasa_interes / 100) / 12
# - Aplica el interés al saldo
# - Retorna el monto de interés generado
```

## 📊 Flujo de Datos

### Creación de Cuenta
```
1. Cliente → POST /api/accounts
2. Validar tipo de cuenta
3. Crear instancia según tipo:
   - CuentaAhorro (con tasa_interes, limite_retiros)
   - CuentaCorriente (con limite_descubierto)
4. Guardar en cuentas.json
5. Retornar cuenta creada
```

### Realizar Transacción
```
1. Cliente → POST /api/transactions/transfer
2. Cargar cuenta_origen desde JSON
3. Instanciar objeto según tipo (CuentaAhorro/CuentaCorriente)
4. Ejecutar cuenta_origen.retirar(monto)
   - Usa lógica específica de cada clase
5. Cargar cuenta_destino desde JSON
6. Instanciar objeto según tipo
7. Ejecutar cuenta_destino.depositar(monto)
8. Guardar ambas cuentas en JSON
9. Registrar transacción
```

## 🗂️ Persistencia con Archivos JSON

El sistema usa archivos JSON como "base de datos":

### clientes.json
```json
[
  {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "0801199012345",
    "email": "juan@email.com",
    "password": "hash...",
    "fecha_registro": "2024-11-17T10:30:00"
  }
]
```

### cuentas.json
```json
[
  {
    "id_cuenta": 1,
    "id_cliente": 1,
    "numero_cuenta": "1234567890123456",
    "tipo_cuenta": "ahorro",
    "saldo": 5000.00,
    "tasa_interes": 3.5,
    "limite_retiros": 5,
    "retiros_realizados": 2,
    "estado": "activa"
  },
  {
    "id_cuenta": 2,
    "id_cliente": 1,
    "numero_cuenta": "6543210987654321",
    "tipo_cuenta": "corriente",
    "saldo": -500.00,
    "limite_descubierto": 1000.00,
    "estado": "activa"
  }
]
```

### transacciones.json
```json
[
  {
    "id_transaccion": 1,
    "numero_cuenta_origen": "1234567890123456",
    "numero_cuenta_destino": null,
    "tipo_transaccion": "deposito",
    "monto": 1000.00,
    "fecha_hora": "2024-11-17T11:00:00",
    "estado": "completada"
  }
]
```

## 🔐 Principios SOLID Aplicados

### 1. **Single Responsibility (SRP)**
- Cada clase tiene una responsabilidad única
- `Cliente`: gestión de usuarios
- `Cuenta`: operaciones bancarias base
- `Transaccion`: registro de movimientos

### 2. **Open/Closed Principle (OCP)**
- Las clases están abiertas para extensión (puedes crear nuevos tipos de cuenta)
- Cerradas para modificación (no necesitas cambiar Cuenta para agregar tipos)

### 3. **Liskov Substitution (LSP)**
- Cualquier `Cuenta` puede ser sustituida por `CuentaAhorro` o `CuentaCorriente`
- El código cliente trabaja con la abstracción `Cuenta`

### 4. **Interface Segregation (ISP)**
- Cada clase tiene solo los métodos que necesita
- CuentaAhorro tiene `calcular_interes()`
- CuentaCorriente tiene `tiene_sobregiro()`

### 5. **Dependency Inversion (DIP)**
- El código depende de abstracciones (`Cuenta`) no de implementaciones concretas
- Las transacciones trabajan con cualquier tipo de cuenta

## 🎓 Ventajas de esta Arquitectura

✅ **Extensible**: Fácil agregar nuevos tipos de cuenta
✅ **Mantenible**: Cambios en un tipo no afectan otros
✅ **Reutilizable**: Código común en la clase base
✅ **Testeable**: Cada clase se puede probar independientemente
✅ **Clara**: La jerarquía refleja el modelo del negocio

## 🚀 Cómo Agregar un Nuevo Tipo de Cuenta

```python
class CuentaInversion(Cuenta):
    def __init__(self, id_cuenta, id_cliente, numero_cuenta, saldo=0.00, 
                 tasa_rendimiento=5.0, monto_minimo=10000.00):
        super().__init__(id_cuenta, id_cliente, numero_cuenta, saldo)
        self.tasa_rendimiento = tasa_rendimiento
        self.monto_minimo = monto_minimo
    
    def depositar(self, monto):
        if self.saldo + monto < self.monto_minimo:
            return False, f"El saldo mínimo debe ser {self.monto_minimo}"
        self.saldo += monto
        return True, "Depósito exitoso"
    
    def retirar(self, monto):
        if self.saldo - monto < self.monto_minimo:
            return False, f"No puede retirar, debe mantener {self.monto_minimo}"
        if self.saldo < monto:
            return False, "Saldo insuficiente"
        self.saldo -= monto
        return True, "Retiro exitoso"
    
    def calcular_rendimiento_anual(self):
        return self.saldo * (self.tasa_rendimiento / 100)
```
