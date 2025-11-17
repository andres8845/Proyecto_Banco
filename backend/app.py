from flask import Flask, request, jsonify
from initFiles import initFiles

app = Flask(__name__)

# Ejecutar init files (crea carpetas y archivos JSON)
initFiles()

@app.route("/", methods=["GET"])
def home():
    return jsonify({"mensaje": "Servidor Python funcionando"})

if __name__ == "__main__":
    app.run(port=3000, debug=True)
