// Responde en JSON las rutas de la API que no existen y los errores inesperados; lo usa app.js.
function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: `No existe la ruta ${req.method} ${req.originalUrl}.` });
}

function manejarErrores(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido." });
  }
  console.error(error);
  res.status(500).json({ error: "Ocurrió un error en el servidor." });
}

module.exports = { rutaNoEncontrada, manejarErrores };
