# 🏦 Sistema Bancario Digital - Proyecto Completo

Sistema bancario completo con arquitectura **Orientada a Objetos** usando **Python/Flask** en el backend y **React** en el frontend.

## 🎯 Características del Proyecto

### Backend (Python)
- ✅ **Arquitectura POO** con herencia y polimorfismo
- ✅ Clase abstracta `Cuenta` con implementaciones `CuentaAhorro` y `CuentaCorriente`
- ✅ **Operaciones bancarias**: Depósito, Retiro, Transferencia
- ✅ **Cálculo de intereses** para cuentas de ahorro
- ✅ **Sobregiro** para cuentas corrientes
- ✅ **Autenticación JWT** con tokens
- ✅ **Base de datos en archivos JSON**

### Frontend (React)
- ✅ Sistema de autenticación (Login/Register)
- ✅ Dashboard con resumen financiero
- ✅ Gestión de cuentas
- ✅ Historial de transacciones
- ✅ Sistema de transferencias
- ✅ Diseño moderno y responsivo

## 📁 Estructura del Proyecto

```
Proyecto_Banco/
├── backend/                    # Backend Python
│   ├── data/                   # Archivos JSON (base de datos)
│   │   ├── clientes.json
│   │   ├── cuentas.json
│   │   └── transacciones.json
│   ├── models/                 # Modelos POO
│   │   ├── Cliente.py
│   │   ├── Cuenta.py          # Clase abstracta + CuentaAhorro + CuentaCorriente
│   │   └── Transaccion.py
│   ├── routes/                 # API Routes
│   │   ├── auth.py
│   │   ├── accounts.py
│   │   ├── transactions.py
│   │   └── operations.py
│   ├── utils/                  # Utilidades
│   │   ├── auth.py            # JWT y passwords
│   │   └── file_manager.py    # Manejo de JSON
│   ├── app.py                  # Aplicación principal
│   ├── initFiles.py
│   ├── test_poo.py            # Script de prueba
│   ├── requirements.txt
│   ├── README_BACKEND.md
│   └── ARQUITECTURA_POO.md    # Documentación técnica
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── apis/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Accounts.js
│   │   │   ├── Transactions.js
│   │   │   └── Transfer.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README_FRONTEND.md
│
└── docker-compose.yml
```

## 🏛️ Arquitectura POO

### Jerarquía de Clases

```
      Cuenta (ABC)
      /          \
CuentaAhorro  CuentaCorriente
```

#### Cuenta (Abstracta)
- Define la estructura común de todas las cuentas
- Métodos abstractos: `depositar()`, `retirar()`
- Métodos concretos: `consultar_saldo()`, `generar_numero_cuenta()`

#### CuentaAhorro
- **Hereda** de Cuenta
- Genera **intereses mensuales**
- Tiene **límite de retiros** mensuales
- Ideal para ahorro a largo plazo

#### CuentaCorriente
- **Hereda** de Cuenta
- Permite **sobregiro** (saldo negativo)
- Sin límite de retiros
- Ideal para uso diario

### Ejemplo de Uso

```python
# Crear cuenta de ahorro
cuenta_ahorro = CuentaAhorro(
    id_cuenta=1,
    id_cliente=1,
    numero_cuenta="1234567890123456",
    saldo=5000.00,
    tasa_interes=3.5,
    limite_retiros=5
)

# Depositar
cuenta_ahorro.depositar(1000.00)

# Retirar (valida límite de retiros)
exito, mensaje = cuenta_ahorro.retirar(500.00)

# Calcular intereses
interes = cuenta_ahorro.calcular_interes()
```

## 🚀 Instalación y Ejecución

### Backend

1. Instalar dependencias:
```bash
cd backend
pip install -r requirements.txt
```

2. Ejecutar servidor:
```bash
python app.py
```

El backend estará en `http://localhost:5000`

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm start
```

El frontend estará en `http://localhost:3000`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Cuentas
- `GET /api/accounts` - Listar cuentas del usuario
- `POST /api/accounts` - Crear nueva cuenta
- `GET /api/accounts/<numero>` - Ver cuenta específica

### Transacciones
- `GET /api/transactions` - Listar transacciones
- `GET /api/transactions/recent` - Últimas transacciones
- `POST /api/transactions/transfer` - Transferir dinero
- `POST /api/transactions/deposit` - Depositar
- `POST /api/transactions/withdraw` - Retirar

### Operaciones Especiales
- `POST /api/operations/calculate-interest` - Calcular interés (ahorro)
- `POST /api/operations/reset-withdrawal-limit` - Reiniciar límite de retiros
- `GET /api/operations/overdraft-status/<numero>` - Estado de sobregiro

## 🧪 Pruebas

Ejecutar el script de prueba del backend:

```bash
cd backend
python test_poo.py
```

Este script prueba:
- ✅ Creación de clientes
- ✅ Creación de cuentas (ahorro y corriente)
- ✅ Depósitos y retiros
- ✅ Límite de retiros en cuenta ahorro
- ✅ Sobregiro en cuenta corriente
- ✅ Transferencias entre cuentas
- ✅ Cálculo de intereses

## 💾 Base de Datos (JSON)

El sistema usa archivos JSON para persistencia:

### clientes.json
```json
[
  {
    "id_cliente": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "dni": "0801199012345",
    "email": "juan@email.com",
    "password": "hash_sha256",
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
    "retiros_realizados": 2
  }
]
```

### transacciones.json
```json
[
  {
    "id_transaccion": 1,
    "numero_cuenta_origen": "1234567890123456",
    "numero_cuenta_destino": "6543210987654321",
    "tipo_transaccion": "transferencia",
    "monto": 500.00,
    "fecha_hora": "2024-11-17T11:00:00",
    "estado": "completada"
  }
]
```

## 🔐 Seguridad

- **JWT** para autenticación
- **SHA256** para hash de contraseñas
- **CORS** configurado para el frontend
- Validación de permisos en cada endpoint

## 📚 Documentación Adicional

- **[Backend README](backend/README_BACKEND.md)** - Documentación completa del backend
- **[Frontend README](frontend/README_FRONTEND.md)** - Documentación del frontend
- **[Arquitectura POO](backend/ARQUITECTURA_POO.md)** - Diseño orientado a objetos en detalle

## 🎓 Conceptos Implementados

### Programación Orientada a Objetos
- ✅ **Abstracción**: Clase abstracta Cuenta
- ✅ **Herencia**: CuentaAhorro y CuentaCorriente heredan de Cuenta
- ✅ **Polimorfismo**: Mismo método, diferente comportamiento
- ✅ **Encapsulamiento**: Datos y métodos agrupados en clases

### Principios SOLID
- ✅ **Single Responsibility**: Cada clase tiene una responsabilidad
- ✅ **Open/Closed**: Abierto para extensión, cerrado para modificación
- ✅ **Liskov Substitution**: Las clases hijas pueden sustituir a la padre
- ✅ **Interface Segregation**: Interfaces específicas por necesidad
- ✅ **Dependency Inversion**: Depender de abstracciones, no implementaciones

## 👥 Autores

- Sistema diseñado para proyecto bancario educativo
- Implementación de POO en Python
- Frontend moderno con React

## 📝 Licencia

Este proyecto es de código abierto para fines educativos.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 🎯 Próximas Mejoras

- [ ] Agregar más tipos de cuenta (Inversión, Plazo Fijo)
- [ ] Implementar reportes en PDF
- [ ] Agregar notificaciones por email
- [ ] Implementar límites de transacción
- [ ] Agregar auditoría de logs
- [ ] Modo oscuro en frontend
- [ ] Gráficos de estadísticas
- [ ] Exportar datos a Excel
