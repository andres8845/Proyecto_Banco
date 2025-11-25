import requests
import json

# Primero, hacer login para obtener el token
print("=" * 60)
print("1. Intentando login...")
try:
    response = requests.post(
        "http://localhost:5001/api/auth/login",
        json={"email": "sandrofernandez@unitec.edu", "password": "12345678"},
        timeout=5
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        token = response.json()['token']
        print(f"✅ Token obtenido: {token[:50]}...")
        
        # Ahora intentar obtener las cuentas
        print("\n" + "=" * 60)
        print("2. Intentando obtener cuentas...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(
            "http://localhost:5001/api/accounts",
            headers=headers,
            timeout=5
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        # Intentar obtener dashboard stats
        print("\n" + "=" * 60)
        print("3. Intentando obtener dashboard stats...")
        response = requests.get(
            "http://localhost:5001/api/dashboard/stats",
            headers=headers,
            timeout=5
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
    else:
        print(f"❌ Error en login: {response.json()}")
        
except requests.exceptions.ConnectionError as e:
    print(f"❌ Error de conexión: {e}")
except requests.exceptions.Timeout as e:
    print(f"❌ Timeout: {e}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
