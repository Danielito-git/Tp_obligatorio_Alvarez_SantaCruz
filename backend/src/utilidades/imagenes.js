// Carpeta donde se guardan las imagenes de los productos y borrado de una imagen recien subida; lo usan subirImagen.js, validarProductos.js y productosControlador.js.
const fs = require("fs/promises");
const path = require("path");

const carpetaImagenes = path.join(__dirname, "..", "..", "imagenes", "productos");

// Se usa cuando la imagen ya se guardó pero el producto no se pudo crear.
async function borrarImagenSubida(archivo) {
  if (!archivo) return;
  try {
    await fs.unlink(archivo.path);
  } catch {

  }
}

module.exports = { carpetaImagenes, borrarImagenSubida };
