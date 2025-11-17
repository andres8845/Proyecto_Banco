# Backend - Sistema Bancario en Python

Backend completo en Python/Flask con sistema de archivos JSON simulando una base de datos.

## 🚀 Características Implementadas

- ✅ **Autenticación**: Registro, Login, JWT
- ✅ **Gestión de Clientes**: CRUD completo
- ✅ **Gestión de Cuentas**: Crear cuentas, ver información
- ✅ **Transacciones**: Depósitos, retiros, transferencias
- ✅ **Seguridad**: Hash de contraseñas, JWT tokens
- ✅ **Sistema de Archivos**: JSON como base de datos

## 📁 Estructura del Proyecto

```
backend/
├── data/                      # Archivos JSON (base de datos)
│   ├── clientes.json
│   ├── cuentas.json
│   └── transacciones.json
├── models/                    # Modelos de datos
│   ├── Cliente.py
│   ├── Cuenta.py
│   └── Transaccion.py
├── routes/                    # Rutas del API
│   ├── auth.py
│   ├── accounts.py
│   └── transactions.py
├── utils/                     # Utilidades
│   ├── auth.py               # JWT y passwords
│   └── file_manager.py       # Manejo de archivos JSON
├── app.py                     # Archivo principal
├── initFiles.py              # Inicialización de archivos
└── requirements.txt          # Dependencias
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
pip install -r requirements.txt
```

2. Ejecutar el servidor:
```bash
python app.py
```

El servidor se ejecutará en `http://localhost:5000`

## 📡 API Endpoints

### Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registra un nuevo usuario
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "0801199012345",
  "direccion": "Tegucigalpa, Honduras",
  "telefono": "+504 9999-8888",
  "email": "juan@email.com",
  "password": "password123"
}
```

#### POST `/api/auth/login`
Inicia sesión
```json
{
  "email": "juan@email.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Obtiene información del usuario actual (requiere token)
```
Header: Authorization: Bearer <token>
```

### Cuentas (`/api/accounts`)

#### GET `/api/accounts/`
Obtiene todas las cuentas del usuario autenticado
```
Header: Authorization: Bearer <token>
```

#### POST `/api/accounts/`
Crea una nueva cuenta
```json
{
  "tipo_cuenta": "ahorro",
  "saldo_inicial": 1000.00
}
```

#### GET `/api/accounts/<numero_cuenta>`
Obtiene información de una cuenta específica

### Transacciones (`/api/transactions`)

#### GET `/api/transactions/`
Obtiene todas las transacciones del usuario

#### GET `/api/transactions/recent`
Obtiene las últimas 10 transacciones

#### POST `/api/transactions/transfer`
Realiza una transferencia
```json
{
  "cuenta_origen": "1234567890123456",
  "cuenta_destino": "6543210987654321",
  "monto": 500.00,
  "descripcion": "Pago de servicio"
}
```

#### POST `/api/transactions/deposit`
Realiza un depósito
```json
{
  "numero_cuenta": "1234567890123456",
  "monto": 1000.00,
  "descripcion": "Depósito en efectivo"
}
```

#### POST `/api/transactions/withdraw`
Realiza un retiro
```json
{
  "numero_cuenta": "1234567890123456",
  "monto": 200.00,
  "descripcion": "Retiro de cajero"
}
```

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación:
1. El usuario inicia sesión y recibe un token
2. El token debe incluirse en el header de cada petición protegida:
   ```
   Authorization: Bearer <token>
   ```
3. Los tokens expiran después de 7 días

## 💾 Estructura de Datos

### Cliente
```json
{
  "id_cliente": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "0801199012345",
  "direccion": "Tegucigalpa",
  "telefono": "+504 9999-8888",
  "email": "juan@email.com",
  "password": "hash_de_la_contraseña",
  "fecha_registro": "2024-11-17T10:30:00"
}
```

### Cuenta
```json
{
  "id_cuenta": 1,
  "id_cliente": 1,
  "numero_cuenta": "1234567890123456",
  "tipo_cuenta": "ahorro",
  "saldo": 5000.00,
  "fecha_apertura": "2024-11-17T10:35:00",
  "estado": "activa"
}
```

### Transacción
```json
{
  "id_transaccion": 1,
  "numero_cuenta_origen": "1234567890123456",
  "numero_cuenta_destino": "6543210987654321",
  "tipo_transaccion": "transferencia",
  "monto": 500.00,
  "fecha_hora": "2024-11-17T11:00:00",
  "descripcion": "Pago de servicio",
  "estado": "completada"
}
```

## 🔧 Configuración

### Cambiar Puerto
Edita `app.py` línea final:
```python
app.run(host='0.0.0.0', port=TU_PUERTO, debug=True)
```

### Cambiar Secret Key para JWT
Edita `utils/auth.py`:
```python
SECRET_KEY = "tu_clave_secreta_aqui"
```

## 🚀 Producción

Para producción, usa un servidor WSGI como Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📝 Notas

- Las contraseñas se hashean con SHA256
- Los archivos JSON se crean automáticamente al iniciar
- El sistema valida saldos antes de realizar transacciones
- Todas las fechas están en formato ISO 8601

## 🤝 Integración con Frontend

El backend está configurado para trabajar con el frontend React en `http://localhost:3000`. CORS está habilitado para permitir peticiones desde el frontend.
