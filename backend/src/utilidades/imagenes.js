// Carpeta donde se guardan las imagenes de los productos y borrado de imagenes; lo usan subirImagen.js, validarProductos.js y productosControlador.js.
const fs = require("fs/promises");
const path = require("path");

const carpetaImagenes = path.join(__dirname, "..", "..", "imagenes", "productos");

// Se usa cuando la imagen ya se guardo pero el producto no se pudo crear, para no dejar archivos huérfanos.
async function borrarImagenSubida(archivo) {
  if (!archivo) return;
  try {
    await fs.unlink(archivo.path);
  } catch {
  }
}

// Borra una imagen ya guardada en la base (por ejemplo "imagenes/productos/Ryzen6.png") cuando el producto cambio de imagen o se eliminó.
async function borrarImagenGuardada(rutaRelativa) {
  try {
    await fs.unlink(path.join(carpetaImagenes, path.basename(rutaRelativa)));
  } catch {

  }
}

module.exports = { carpetaImagenes, borrarImagenSubida, borrarImagenGuardada };
