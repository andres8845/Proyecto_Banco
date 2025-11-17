# Script de Prueba - Sistema Bancario POO
# Este script demuestra el uso de las clases con herencia

from models.Cliente import Cliente
from models.Cuenta import Cuenta, CuentaAhorro, CuentaCorriente
from models.Transaccion import Transaccion

def test_sistema_bancario():
    print("=" * 60)
    print("🏦 PRUEBA DEL SISTEMA BANCARIO - ARQUITECTURA POO")
    print("=" * 60)
    
    # 1. Crear Cliente
    print("\n1️⃣ CREAR CLIENTE")
    print("-" * 60)
    cliente, error = Cliente.crear_cliente(
        nombre="María",
        apellido="González",
        dni="0801199054321",
        direccion="Tegucigalpa, Honduras",
        telefono="+504 9876-5432",
        email="maria@test.com",
        password="password123"
    )
    
    if error:
        print(f"❌ Error: {error}")
        return
    
    print(f"✅ Cliente creado:")
    print(f"   ID: {cliente['id_cliente']}")
    print(f"   Nombre: {cliente['nombre']} {cliente['apellido']}")
    print(f"   Email: {cliente['email']}")
    
    # 2. Crear Cuenta de Ahorro
    print("\n2️⃣ CREAR CUENTA DE AHORRO")
    print("-" * 60)
    cuenta_ahorro, error = Cuenta.crear_cuenta(
        id_cliente=cliente['id_cliente'],
        tipo_cuenta='ahorro',
        saldo_inicial=5000.00,
        tasa_interes=4.5,
        limite_retiros=3
    )
    
    if error:
        print(f"❌ Error: {error}")
        return
    
    print(f"✅ Cuenta de Ahorro creada:")
    print(f"   Número: {cuenta_ahorro['numero_cuenta']}")
    print(f"   Saldo: L. {cuenta_ahorro['saldo']}")
    print(f"   Tasa de Interés: {cuenta_ahorro['tasa_interes']}%")
    print(f"   Límite de Retiros: {cuenta_ahorro['limite_retiros']}")
    
    # 3. Crear Cuenta Corriente
    print("\n3️⃣ CREAR CUENTA CORRIENTE")
    print("-" * 60)
    cuenta_corriente, error = Cuenta.crear_cuenta(
        id_cliente=cliente['id_cliente'],
        tipo_cuenta='corriente',
        saldo_inicial=2000.00,
        limite_descubierto=1000.00
    )
    
    if error:
        print(f"❌ Error: {error}")
        return
    
    print(f"✅ Cuenta Corriente creada:")
    print(f"   Número: {cuenta_corriente['numero_cuenta']}")
    print(f"   Saldo: L. {cuenta_corriente['saldo']}")
    print(f"   Límite de Descubierto: L. {cuenta_corriente['limite_descubierto']}")
    
    # 4. Probar Depósito
    print("\n4️⃣ DEPÓSITO EN CUENTA DE AHORRO")
    print("-" * 60)
    transaccion, error = Transaccion.crear_transaccion(
        numero_cuenta_origen=cuenta_ahorro['numero_cuenta'],
        tipo='deposito',
        monto=1500.00,
        descripcion="Depósito de prueba"
    )
    
    if error:
        print(f"❌ Error: {error}")
    else:
        print(f"✅ Depósito exitoso:")
        print(f"   Monto: L. {transaccion['monto']}")
        print(f"   Nuevo saldo: L. {Cuenta.obtener_cuenta_por_numero(cuenta_ahorro['numero_cuenta'])['saldo']}")
    
    # 5. Probar Retiro (Cuenta Ahorro con límite)
    print("\n5️⃣ RETIRO EN CUENTA DE AHORRO (con límite)")
    print("-" * 60)
    
    for i in range(4):
        transaccion, error = Transaccion.crear_transaccion(
            numero_cuenta_origen=cuenta_ahorro['numero_cuenta'],
            tipo='retiro',
            monto=500.00,
            descripcion=f"Retiro #{i+1}"
        )
        
        if error:
            print(f"❌ Retiro #{i+1}: {error}")
            break
        else:
            print(f"✅ Retiro #{i+1} exitoso: L. 500.00")
    
    # 6. Probar Sobregiro en Cuenta Corriente
    print("\n6️⃣ RETIRO CON SOBREGIRO EN CUENTA CORRIENTE")
    print("-" * 60)
    transaccion, error = Transaccion.crear_transaccion(
        numero_cuenta_origen=cuenta_corriente['numero_cuenta'],
        tipo='retiro',
        monto=2500.00,  # Más que el saldo, pero dentro del límite de descubierto
        descripcion="Retiro con sobregiro"
    )
    
    if error:
        print(f"❌ Error: {error}")
    else:
        cuenta_actualizada = Cuenta.obtener_cuenta_por_numero(cuenta_corriente['numero_cuenta'])
        print(f"✅ Retiro con sobregiro exitoso:")
        print(f"   Monto retirado: L. {transaccion['monto']}")
        print(f"   Saldo actual: L. {cuenta_actualizada['saldo']}")
        print(f"   {'⚠️ CUENTA EN SOBREGIRO' if cuenta_actualizada['saldo'] < 0 else '✅ Saldo positivo'}")
    
    # 7. Probar Transferencia
    print("\n7️⃣ TRANSFERENCIA ENTRE CUENTAS")
    print("-" * 60)
    transaccion, error = Transaccion.crear_transaccion(
        numero_cuenta_origen=cuenta_ahorro['numero_cuenta'],
        tipo='transferencia',
        monto=1000.00,
        numero_cuenta_destino=cuenta_corriente['numero_cuenta'],
        descripcion="Transferencia entre mis cuentas"
    )
    
    if error:
        print(f"❌ Error: {error}")
    else:
        ahorro_final = Cuenta.obtener_cuenta_por_numero(cuenta_ahorro['numero_cuenta'])
        corriente_final = Cuenta.obtener_cuenta_por_numero(cuenta_corriente['numero_cuenta'])
        print(f"✅ Transferencia exitosa:")
        print(f"   Monto: L. {transaccion['monto']}")
        print(f"   Saldo Ahorro: L. {ahorro_final['saldo']}")
        print(f"   Saldo Corriente: L. {corriente_final['saldo']}")
    
    # 8. Calcular Intereses (solo para Cuenta Ahorro)
    print("\n8️⃣ CALCULAR INTERESES (Cuenta de Ahorro)")
    print("-" * 60)
    cuenta_ahorro_data = Cuenta.obtener_cuenta_por_numero(cuenta_ahorro['numero_cuenta'])
    cuenta_ahorro_obj = CuentaAhorro(
        id_cuenta=cuenta_ahorro_data['id_cuenta'],
        id_cliente=cuenta_ahorro_data['id_cliente'],
        numero_cuenta=cuenta_ahorro_data['numero_cuenta'],
        saldo=cuenta_ahorro_data['saldo'],
        tasa_interes=cuenta_ahorro_data['tasa_interes'],
        limite_retiros=cuenta_ahorro_data['limite_retiros']
    )
    
    interes = cuenta_ahorro_obj.calcular_interes()
    print(f"✅ Interés calculado:")
    print(f"   Tasa: {cuenta_ahorro_data['tasa_interes']}% anual")
    print(f"   Interés mensual: L. {interes:.2f}")
    print(f"   Nuevo saldo: L. {cuenta_ahorro_obj.saldo:.2f}")
    
    # 9. Resumen Final
    print("\n" + "=" * 60)
    print("📊 RESUMEN FINAL")
    print("=" * 60)
    
    todas_cuentas = Cuenta.obtener_cuentas_por_cliente(cliente['id_cliente'])
    total_saldo = sum(c['saldo'] for c in todas_cuentas)
    
    print(f"\n👤 Cliente: {cliente['nombre']} {cliente['apellido']}")
    print(f"📧 Email: {cliente['email']}")
    print(f"\n💰 Cuentas:")
    for cuenta in todas_cuentas:
        print(f"   • {cuenta['tipo_cuenta'].upper()}: L. {cuenta['saldo']:.2f}")
    print(f"\n💵 Saldo Total: L. {total_saldo:.2f}")
    
    transacciones = Transaccion.obtener_transacciones_por_cliente(cliente['id_cliente'])
    print(f"\n📈 Total de Transacciones: {len(transacciones)}")
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA COMPLETADA EXITOSAMENTE")
    print("=" * 60)

if __name__ == "__main__":
    # Limpiar archivos de datos antes de la prueba
    import os
    from utils.file_manager import write_json
    
    print("🧹 Limpiando archivos de datos para prueba limpia...")
    write_json('clientes.json', [])
    write_json('cuentas.json', [])
    write_json('transacciones.json', [])
    print("✅ Archivos limpiados\n")
    
    # Ejecutar pruebas
    test_sistema_bancario()
