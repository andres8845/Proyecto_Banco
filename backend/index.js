const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para poder leer JSON
app.use(express.json());

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
