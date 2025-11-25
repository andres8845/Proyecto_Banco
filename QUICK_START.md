# 🚀 Guía Rápida de Inicio - Sistema Bancario

## ✅ Todo está listo!

El backend y frontend están completamente integrados y funcionando.

## 📋 Pasos para Iniciar

### 1. Iniciar el Backend

```bash
# En una terminal
cd backend
python app.py
```

Verás un mensaje como:
```
 * Running on http://127.0.0.1:5001
 * Debug mode: on
```

### 2. Iniciar el Frontend

```bash
# En OTRA terminal
cd frontend
npm install  # Solo la primera vez
npm start
```

Se abrirá automáticamente en: `http://localhost:3000`

### 3. Probar la Aplicación

#### Primer Uso:
1. **Registro**: Crea un nuevo usuario
   - Nombre: Tu nombre
   - Apellido: Tu apellido
   - DNI: 0801XXXXXXXX
   - Email: tu@email.com
   - Password: (lo que quieras)

2. **Crear Cuenta**: 
   - Tipo: Ahorro o Corriente
   - Saldo inicial: 1000.00 (por ejemplo)

3. **Probar Funcionalidades**:
   - ✅ Ver Dashboard con estadísticas
   - ✅ Realizar un depósito
   - ✅ Hacer una transferencia
   - ✅ Ver historial de transacciones

## 🧪 Verificar que Todo Funciona

Ejecuta el script de prueba:

```bash
cd backend
python test_integration.py
```

Verás:
```
🧪 VERIFICACIÓN DE INTEGRACIÓN BACKEND-FRONTEND
============================================================

✓ Servidor funcionando correctamente
✓ Usuario registrado correctamente
✓ Cuenta creada correctamente
✓ Cuentas obtenidas: 1 cuenta(s)
✓ Depósito realizado correctamente
✓ Estadísticas obtenidas - Balance: L. 1500.0
✓ Analytics obtenidos - 1 transacciones
✓ Categorías obtenidas: 4 categorías

✅ VERIFICACIÓN COMPLETADA
============================================================
```

## 📱 Funcionalidades Disponibles

### En el Frontend:

1. **Dashboard** (`/dashboard`)
   - Balance total
   - Cuentas activas
   - Transacciones recientes
   - Estadísticas mensuales

2. **Cuentas** (`/accounts`)
   - Listar todas tus cuentas
   - Crear nueva cuenta
   - Ver detalles

3. **Transferencias** (`/transfer`)
   - Entre tus propias cuentas
   - A otras cuentas (si existe el número)

4. **Transacciones** (`/transactions`)
   - Historial completo
   - Filtrar por tipo
   - Ver detalles

5. **Depósitos** (`/deposit`)
   - Depositar a tus cuentas

6. **Retiros** (`/withdraw`)
   - Retirar de tus cuentas

## 🔧 Solución de Problemas

### Backend no inicia:
```bash
# Verificar que tienes las dependencias
pip install -r requirements.txt

# Verificar que el puerto 5001 está libre
# En Windows:
netstat -ano | findstr :5001
```

### Frontend no inicia:
```bash
# Limpiar node_modules e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
npm start
```

### Error de CORS:
- Verificar que el backend está en `http://localhost:5001`
- Verificar que el frontend está en `http://localhost:3000`

### Token inválido:
- Hacer logout y login de nuevo
- Limpiar localStorage del navegador

## 📚 Documentación Adicional

- `INTEGRATION_GUIDE.md` - Guía completa de la integración
- `INTEGRATION_SUMMARY.md` - Resumen ejecutivo
- `README_BACKEND.md` - Documentación del backend
- `README_FRONTEND.md` - Documentación del frontend
- `ARQUITECTURA_POO.md` - Arquitectura orientada a objetos

## 🎯 Endpoints API Principales

### Autenticación
- POST `/api/auth/register` - Registrarse
- POST `/api/auth/login` - Login

### Cuentas
- GET `/api/accounts` - Mis cuentas
- POST `/api/accounts` - Crear cuenta

### Transacciones
- POST `/api/transactions/deposit` - Depositar
- POST `/api/transactions/withdraw` - Retirar
- POST `/api/transactions/transfer` - Transferir

### Dashboard
- GET `/api/dashboard/stats` - Estadísticas
- GET `/api/dashboard/analytics` - Analytics

## 💡 Tips

1. **Usa números de cuenta reales** cuando hagas transferencias (cópialos del dashboard)

2. **Las cuentas de ahorro** tienen:
   - Tasa de interés
   - Límite de retiros mensuales

3. **Las cuentas corrientes** tienen:
   - Posibilidad de sobregiro
   - Sin límite de retiros

4. **El token JWT expira** después de un tiempo, necesitarás hacer login de nuevo

## 🎨 Mejoras Futuras Sugeridas

- [ ] Agregar gráficas con Chart.js
- [ ] Implementar notificaciones
- [ ] Exportar transacciones a PDF
- [ ] Tema oscuro
- [ ] Búsqueda avanzada de transacciones
- [ ] Transferencias programadas
- [ ] Alertas de saldo bajo

## ❓ Preguntas Frecuentes

**P: ¿Dónde se guardan los datos?**
R: En archivos JSON en `backend/data/`

**P: ¿Puedo ver los datos directamente?**
R: Sí, abre los archivos JSON en `backend/data/`

**P: ¿Cómo reinicio todo?**
R: Borra los archivos JSON en `backend/data/` y reinicia el servidor

**P: ¿El sistema es seguro?**
R: Las contraseñas están hasheadas con bcrypt y usa JWT para autenticación

## 🎉 ¡Listo para Usar!

Todo está configurado y funcionando. Solo inicia backend y frontend y comienza a probar.

**Disfruta tu sistema bancario digital!** 🏦
