const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data");

const requiredFiles = ["clientes.json", "cuentas.json", "transacciones.json"];

function initFiles() {
  // Crear carpeta /data si no existe
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath);
    console.log("📁 Carpeta /data creada");
  }

  // Crear archivos vacíos si no existen
  requiredFiles.forEach((file) => {
    const filePath = path.join(dataPath, file);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]"); // Puedes usar {} según tu estructura
      console.log(`📄 Archivo creado: ${file}`);
    }
  });

  console.log("✔ Archivos verificados correctamente.");
}

module.exports = initFiles;
