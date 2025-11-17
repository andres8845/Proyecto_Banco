const express = require("express");
const app = express();
const PORT = 3000;
const initFiles = require("./src/initFiles");

// Crear archivos antes de iniciar la app
initFiles();

// Middleware para poder leer JSON
app.use(express.json());

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
