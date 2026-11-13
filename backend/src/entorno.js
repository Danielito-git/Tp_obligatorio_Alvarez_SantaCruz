// Carga las variables del archivo .env; lo usan app.js y cargarProductos.js antes que todo lo demás.
const path = require("path");

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env"));
} catch (error) {
  console.error("Falta el archivo backend/.env. Copiá .env.ejemplo como .env y completá tus datos.");
  process.exit(1);
}
