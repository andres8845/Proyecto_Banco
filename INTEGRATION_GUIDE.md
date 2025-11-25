# Integración Backend-Frontend - Sistema Bancario

## 🔗 Conexión Establecida

El backend (Flask/Python) y el frontend (React) están completamente conectados y funcionando.

## 📡 Servicios API Disponibles

### 1. **Account Service** (`accountService.js`)
Gestión de cuentas bancarias:
- `getAllAccounts()` - Obtener todas las cuentas del usuario
- `getAccountByNumber(numeroCuenta)` - Obtener cuenta por número
- `getAccountById(idCuenta)` - Obtener cuenta por ID
- `createAccount(accountData)` - Crear nueva cuenta
- `getAccountsStats()` - Obtener estadísticas de cuentas

### 2. **Transaction Service** (`transactionService.js`)
Gestión de transacciones:
- `getAllTransactions()` - Obtener todas las transacciones
- `getRecentTransactions()` - Últimas 10 transacciones
- `getTransactionsByAccount(numeroCuenta)` - Transacciones por cuenta
- `transfer(transferData)` - Realizar transferencia
- `deposit(depositData)` - Realizar depósito
- `withdraw(withdrawData)` - Realizar retiro
- `getTransactionStats()` - Estadísticas de transacciones

### 3. **Dashboard Service** (`dashboardService.js`)
Datos del dashboard:
- `getDashboardStats()` - Estadísticas generales
- `getAnalytics(period)` - Análisis financiero por período
- `getSummary()` - Resumen completo

### 4. **Payment Service** (`paymentService.js`)
Gestión de pagos:
- `processPayment(paymentData)` - Procesar pago
- `getPaymentHistory()` - Historial de pagos
- `getPaymentCategories()` - Categorías disponibles

## 🎯 Endpoints Backend

### Auth (`/api/auth`)
- `POST /register` - Registro de usuario
- `POST /login` - Inicio de sesión
- `GET /me` - Obtener usuario actual

### Accounts (`/api/accounts`)
- `GET /` - Listar cuentas del usuario
- `POST /` - Crear nueva cuenta
- `GET /<numero_cuenta>` - Obtener cuenta por número
- `GET /id/<id_cuenta>` - Obtener cuenta por ID
- `GET /stats` - Estadísticas de cuentas

### Transactions (`/api/transactions`)
- `GET /` - Listar transacciones
- `GET /recent` - Últimas 10 transacciones
- `GET /by-account/<numero_cuenta>` - Transacciones por cuenta
- `POST /transfer` - Realizar transferencia
- `POST /deposit` - Realizar depósito
- `POST /withdraw` - Realizar retiro
- `GET /stats` - Estadísticas de transacciones

### Dashboard (`/api/dashboard`)
- `GET /stats` - Estadísticas del dashboard
- `GET /analytics?period=<period>` - Análisis financiero
- `GET /summary` - Resumen completo

### Payments (`/api/payments`)
- `POST /process` - Procesar pago
- `GET /history` - Historial de pagos
- `GET /categories` - Categorías de pago

### Operations (`/api/operations`)
- `POST /calculate-interest` - Calcular intereses
- `POST /reset-withdrawal-limit` - Reiniciar límite de retiros

## 🚀 Cómo Usar

### Iniciar Backend
```bash
cd backend
python app.py
```
El servidor estará en: `http://localhost:5001`

### Iniciar Frontend
```bash
cd frontend
npm install
npm start
```
El frontend estará en: `http://localhost:3000`

## 📝 Componentes Actualizados

Los siguientes componentes ahora usan los servicios API:

1. **Dashboard.js** - Usa `dashboardService`, `accountService`, `transactionService`
2. **Accounts.js** - Usa `accountService`
3. **Transfer.js** - Usa `accountService`, `transactionService`
4. **Transactions.js** - Usa `transactionService`
5. **Deposit.js** (nuevo) - Usa `accountService`, `transactionService`
6. **Withdraw.js** (nuevo) - Usa `accountService`, `transactionService`

## 🔐 Autenticación

Todas las peticiones requieren un token JWT que se almacena en `localStorage` después del login/registro.

El `axiosInstance` automáticamente:
- Agrega el token a todas las peticiones
- Incluye cache-busters para peticiones GET
- Configura CORS correctamente

## 🎨 Estructura de Respuestas

### Éxito
```json
{
  "message": "Operación exitosa",
  "data": { /* datos relevantes */ }
}
```

### Error
```json
{
  "message": "Descripción del error"
}
```

## 🔧 Configuración CORS

El backend está configurado para aceptar peticiones de:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`

## 📦 Dependencias

### Backend
- Flask
- Flask-CORS
- PyJWT
- bcrypt

### Frontend
- React
- Axios
- React Router

## ✅ Funcionalidades Implementadas

- ✅ Registro e inicio de sesión
- ✅ Gestión de cuentas (crear, listar, ver detalles)
- ✅ Transferencias entre cuentas
- ✅ Depósitos y retiros
- ✅ Historial de transacciones
- ✅ Dashboard con estadísticas
- ✅ Analytics financieros
- ✅ Sistema de pagos
- ✅ Autenticación con JWT
- ✅ Validaciones de negocio

## 🐛 Manejo de Errores

Los servicios incluyen manejo de errores completo:
- Validación de campos requeridos
- Verificación de permisos
- Validación de saldos
- Mensajes de error descriptivos

## 📱 Páginas Disponibles

1. `/login` - Inicio de sesión
2. `/register` - Registro
3. `/dashboard` - Dashboard principal
4. `/accounts` - Gestión de cuentas
5. `/transfer` - Transferencias
6. `/deposit` - Depósitos
7. `/withdraw` - Retiros
8. `/transactions` - Historial de transacciones

## 🔄 Flujo de Datos

```
Usuario → Componente React → Servicio API → axiosInstance → Backend Flask → Base de Datos (JSON)
```

## 💡 Notas Importantes

1. Todos los servicios están centralizados en `/frontend/src/apis/`
2. La autenticación se maneja automáticamente
3. Los errores se capturan y muestran al usuario
4. Las transacciones son atómicas y validan saldos
5. El backend implementa POO con herencia para las cuentas
