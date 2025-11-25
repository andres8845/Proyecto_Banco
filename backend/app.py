from flask import Flask, request, jsonify
from flask_cors import CORS
from initFiles import initFiles
import logging

# Importar rutas
from routes.auth import auth_bp
from routes.accounts import accounts_bp
from routes.transactions import transactions_bp
from routes.operations import operations_bp
from routes.dashboard import dashboard_bp
from routes.payments import payments_bp


app = Flask(__name__)
# Desactivar strict_slashes para que /api/accounts y /api/accounts/ funcionen igual
app.url_map.strict_slashes = False
# Configurar logging global para ver errores en consola
logging.basicConfig(level=logging.DEBUG)

# Configurar CORS para permitir peticiones desde el frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Cache-Control", "Pragma"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Manejo global de errores para capturar cualquier excepción no controlada
@app.errorhandler(Exception)
def handle_exception(e):
    import traceback
    logging.error("\n==== EXCEPCIÓN GLOBAL ====")
    logging.error(traceback.format_exc())
    return jsonify({"message": f"Error interno del servidor: {str(e)}"}), 500

# Ejecutar init files (crea carpetas y archivos JSON)
initFiles()

# Registrar blueprints (rutas)
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(accounts_bp, url_prefix='/api/accounts')
app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
app.register_blueprint(operations_bp, url_prefix='/api/operations')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
app.register_blueprint(payments_bp, url_prefix='/api/payments')

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "mensaje": "🏦 API Banco Digital - Backend Python",
        "version": "1.0.0",
        "arquitectura": "POO con Herencia (Cuenta Abstracta)",
        "endpoints": {
            "auth": "/api/auth",
            "accounts": "/api/accounts",
            "transactions": "/api/transactions",
            "operations": "/api/operations",
            "dashboard": "/api/dashboard",
            "payments": "/api/payments"
        }
    })

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Servidor funcionando correctamente"})

if __name__ == "__main__":
    print("\n🚀 Iniciando servidor en http://localhost:5001")
    print("📍 Endpoints disponibles:")
    print("   - GET  /api/health")
    print("   - POST /api/auth/login")
    print("   - POST /api/auth/register")
    print("   - GET  /api/accounts")
    print("   - GET  /api/dashboard/stats")
    print("\n")
    app.run(host='0.0.0.0', port=5001, debug=False)
