# Frontend - Sistema Bancario

Frontend completo en React para el sistema bancario con backend en Python.

## 🚀 Características

- ✅ Autenticación de usuarios (Login/Register)
- ✅ Dashboard con resumen de cuentas
- ✅ Gestión de cuentas bancarias
- ✅ Historial de transacciones
- ✅ Transferencias entre cuentas
- ✅ Diseño moderno y responsivo
- ✅ Protección de rutas

## 📁 Estructura del Proyecto

```
frontend/
├── public/
├── src/
│   ├── apis/
│   │   └── axiosInstance.js      # Configuración de Axios
│   ├── components/
│   │   ├── Login.js              # Componente de inicio de sesión
│   │   ├── Register.js           # Componente de registro
│   │   ├── ProtectedRoute.js     # Protección de rutas privadas
│   │   ├── Navbar.js             # Barra de navegación
│   │   ├── Auth.css              # Estilos de autenticación
│   │   └── Navbar.css            # Estilos del navbar
│   ├── context/
│   │   └── AuthContext.js        # Context de autenticación
│   ├── pages/
│   │   ├── Dashboard.js          # Página principal
│   │   ├── Accounts.js           # Gestión de cuentas
│   │   ├── Transactions.js       # Historial de transacciones
│   │   ├── Transfer.js           # Realizar transferencias
│   │   ├── Dashboard.css
│   │   ├── Accounts.css
│   │   ├── Transactions.css
│   │   └── Transfer.css
│   ├── App.js                    # Componente principal con rutas
│   ├── App.css
│   └── index.css                 # Estilos globales
├── package.json
└── README.md
```

## 🛠️ Tecnologías

- **React** 19.2.0
- **React Router DOM** 6.28.0
- **Axios** 1.13.2
- **CSS3** con diseño moderno

## 📡 Conexión con Backend

El frontend está configurado para conectarse al backend Python en:
- **URL Base:** `http://localhost:5000/api`
- **Puerto Backend:** 5000

## 🚀 Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm start
```

El frontend se ejecutará en `http://localhost:3000`

## 🔐 Rutas Disponibles

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Protegidas (requieren autenticación)
- `/dashboard` - Dashboard principal
- `/accounts` - Gestión de cuentas
- `/transactions` - Historial de transacciones
- `/transfer` - Realizar transferencias

## 🎨 Características de Diseño

- Diseño moderno con gradientes
- Componentes responsivos
- Animaciones suaves
- Feedback visual para acciones
- Loading states
- Manejo de errores

## 📋 API Endpoints Esperados

El frontend espera que el backend proporcione los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener usuario actual

### Cuentas
- `GET /api/accounts` - Obtener todas las cuentas del usuario
- `POST /api/accounts` - Crear nueva cuenta

### Transacciones
- `GET /api/transactions` - Obtener todas las transacciones
- `GET /api/transactions/recent` - Obtener transacciones recientes
- `POST /api/transactions/transfer` - Realizar transferencia

## 🔧 Configuración

### Cambiar URL del Backend

Edita `src/apis/axiosInstance.js`:

```javascript
const instance = axios.create({
  baseURL: "http://tu-backend-url:puerto/api",
  withCredentials: true,
});
```

## 📦 Build para Producción

```bash
npm run build
```

Esto generará una carpeta `build/` con los archivos optimizados para producción.

## 🐳 Docker

El proyecto incluye un `Dockerfile` para containerización.

## 🤝 Integración con Backend Python

Asegúrate de que tu backend Python:
1. Esté ejecutándose en el puerto 5000
2. Tenga CORS habilitado para `http://localhost:3000`
3. Implemente los endpoints de la API mencionados
4. Use JWT para autenticación con el header `Authorization: Bearer <token>`

## ✨ Próximas Mejoras

- Paginación en transacciones
- Filtros avanzados
- Gráficos de estadísticas
- Exportar reportes
- Notificaciones en tiempo real
- Modo oscuro
