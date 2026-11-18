// Recibe la imagen de un producto (multipart/form-data) con Multer y la guarda en imagenes/productos; lo usa productosRutas.js.
const crypto = require("crypto");
const multer = require("multer");
const { carpetaImagenes } = require("../utilidades/imagenes");

const extensiones = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const pesoMaximo = 2 * 1024 * 1024;

const almacenamiento = multer.diskStorage({
  destination: carpetaImagenes,
  filename: (req, archivo, devolver) => {
    const unico = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    devolver(null, `${unico}${extensiones[archivo.mimetype]}`);
  },
});

function filtrarArchivo(req, archivo, devolver) {
  if (extensiones[archivo.mimetype]) return devolver(null, true);
  const error = new Error("La imagen debe ser JPG, PNG o WEBP.");
  error.esErrorDeImagen = true;
  devolver(error);
}

const cargar = multer({
  storage: almacenamiento,
  fileFilter: filtrarArchivo,
  limits: { fileSize: pesoMaximo, files: 1 },
}).single("imagen");

const mensajesMulter = {
  LIMIT_FILE_SIZE: "La imagen no puede pesar más de 2 MB.",
  LIMIT_FILE_COUNT: 'Se puede enviar una sola imagen, en el campo "imagen".',
  LIMIT_UNEXPECTED_FILE: 'Se puede enviar una sola imagen, en el campo "imagen".',
};

function subirImagen(req, res, next) {
  cargar(req, res, (error) => {
    if (!error) return next();
    if (error.esErrorDeImagen) return res.status(400).json({ error: error.message });
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ error: mensajesMulter[error.code] ?? "No se pudo procesar la imagen." });
    }
    next(error);
  });
}

module.exports = { subirImagen };
