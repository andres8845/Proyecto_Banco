import os
import json

DATA_FOLDER = "data"

REQUIRED_FILES = {
    "clientes.json": [],
    "cuentas.json": [],
    "transacciones.json": []
}

def initFiles():
    if not os.path.exists(DATA_FOLDER):
        os.makedirs(DATA_FOLDER)
        print("📁 Carpeta 'data' creada.")

    for filename, default in REQUIRED_FILES.items():
        path = os.path.join(DATA_FOLDER, filename)

        if not os.path.exists(path):
            with open(path, "w") as f:
                json.dump(default, f, indent=4)
            print(f"Archivo creado: {filename}")

    print("Archivos verificados correctamente.")

