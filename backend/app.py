from flask import Flask, request, jsonify
from flask_cors import CORS
from initFiles import initFiles

# Importar rutas
from routes.auth import auth_bp
from routes.accounts import accounts_bp
from routes.transactions import transactions_bp
from routes.operations import operations_bp

app = Flask(__name__)

# Configurar CORS para permitir peticiones desde el frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Ejecutar init files (crea carpetas y archivos JSON)
initFiles()

# Registrar blueprints (rutas)
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(accounts_bp, url_prefix='/api/accounts')
app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
app.register_blueprint(operations_bp, url_prefix='/api/operations')

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
            "operations": "/api/operations"
        }
    })

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Servidor funcionando correctamente"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
