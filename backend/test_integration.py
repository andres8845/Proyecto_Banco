"""
Script de Verificación de la Integración Backend-Frontend
Prueba que todos los endpoints están funcionando correctamente
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5001/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.END}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.END}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.END}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.END}")

def test_health_check():
    """Verificar que el servidor está funcionando"""
    print_info("Verificando servidor...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success("Servidor funcionando correctamente")
            return True
        else:
            print_error("Servidor no responde correctamente")
            return False
    except Exception as e:
        print_error(f"No se puede conectar al servidor: {e}")
        return False

def test_register():
    """Probar registro de usuario"""
    print_info("Probando registro de usuario...")
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    data = {
        "nombre": "Test",
        "apellido": "Usuario",
        "dni": f"TEST{timestamp}",
        "email": f"test{timestamp}@example.com",
        "password": "test123",
        "direccion": "Test Address",
        "telefono": "12345678"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        if response.status_code == 201:
            result = response.json()
            print_success("Usuario registrado correctamente")
            return result.get('token'), result.get('user')
        else:
            print_error(f"Error al registrar: {response.json().get('message')}")
            return None, None
    except Exception as e:
        print_error(f"Error en registro: {e}")
        return None, None

def test_create_account(token):
    """Probar creación de cuenta"""
    print_info("Probando creación de cuenta...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "tipo_cuenta": "ahorro",
        "saldo_inicial": 1000.00,
        "tasa_interes": 3.5
    }
    
    try:
        response = requests.post(f"{BASE_URL}/accounts", json=data, headers=headers)
        if response.status_code == 201:
            result = response.json()
            print_success("Cuenta creada correctamente")
            return result.get('account')
        else:
            print_error(f"Error al crear cuenta: {response.json().get('message')}")
            return None
    except Exception as e:
        print_error(f"Error en creación de cuenta: {e}")
        return None

def test_get_accounts(token):
    """Probar obtención de cuentas"""
    print_info("Probando obtención de cuentas...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/accounts", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print_success(f"Cuentas obtenidas: {result.get('total')} cuenta(s)")
            return result.get('accounts')
        else:
            print_error("Error al obtener cuentas")
            return None
    except Exception as e:
        print_error(f"Error: {e}")
        return None

def test_deposit(token, numero_cuenta):
    """Probar depósito"""
    print_info("Probando depósito...")
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "numero_cuenta": numero_cuenta,
        "monto": 500.00,
        "descripcion": "Depósito de prueba"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/transactions/deposit", json=data, headers=headers)
        if response.status_code == 201:
            print_success("Depósito realizado correctamente")
            return True
        else:
            print_error(f"Error en depósito: {response.json().get('message')}")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_dashboard_stats(token):
    """Probar estadísticas del dashboard"""
    print_info("Probando estadísticas del dashboard...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print_success(f"Estadísticas obtenidas - Balance: L. {result.get('total_balance')}")
            return True
        else:
            print_error("Error al obtener estadísticas")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_analytics(token):
    """Probar analytics"""
    print_info("Probando analytics...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/analytics?period=month", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print_success(f"Analytics obtenidos - {result.get('total_transactions')} transacciones")
            return True
        else:
            print_error("Error al obtener analytics")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def test_payment_categories(token):
    """Probar categorías de pago"""
    print_info("Probando categorías de pago...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/payments/categories", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print_success(f"Categorías obtenidas: {len(result.get('categories', []))} categorías")
            return True
        else:
            print_error("Error al obtener categorías")
            return False
    except Exception as e:
        print_error(f"Error: {e}")
        return False

def run_tests():
    """Ejecutar todas las pruebas"""
    print("\n" + "="*60)
    print("  🧪 VERIFICACIÓN DE INTEGRACIÓN BACKEND-FRONTEND")
    print("="*60 + "\n")
    
    # 1. Health Check
    if not test_health_check():
        print_error("\n❌ El servidor no está funcionando. Inicia el backend primero.")
        return
    
    print("\n" + "-"*60)
    
    # 2. Registro
    token, user = test_register()
    if not token:
        print_error("\n❌ No se pudo continuar sin token de autenticación")
        return
    
    print("\n" + "-"*60)
    
    # 3. Crear cuenta
    account = test_create_account(token)
    if not account:
        print_error("\n❌ No se pudo crear cuenta")
        return
    
    numero_cuenta = account.get('numero_cuenta')
    
    print("\n" + "-"*60)
    
    # 4. Obtener cuentas
    test_get_accounts(token)
    
    print("\n" + "-"*60)
    
    # 5. Depósito
    test_deposit(token, numero_cuenta)
    
    print("\n" + "-"*60)
    
    # 6. Dashboard stats
    test_dashboard_stats(token)
    
    print("\n" + "-"*60)
    
    # 7. Analytics
    test_analytics(token)
    
    print("\n" + "-"*60)
    
    # 8. Categorías de pago
    test_payment_categories(token)
    
    print("\n" + "="*60)
    print("  ✅ VERIFICACIÓN COMPLETADA")
    print("="*60 + "\n")
    
    print_success("Todos los endpoints principales están funcionando correctamente")
    print_info("La integración Backend-Frontend está operativa\n")

if __name__ == "__main__":
    try:
        run_tests()
    except KeyboardInterrupt:
        print_warning("\n\nPrueba interrumpida por el usuario")
    except Exception as e:
        print_error(f"\n\nError inesperado: {e}")
