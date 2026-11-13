// Valida el nombre y los productos de una venta antes de guardarla; lo usa ventasRutas.js.
const nombreMin = 2;
const nombreMax = 30;
const patronNombre = /^\p{L}[\p{L} '-]*$/u;
const lineasMaximas = 50;
const cantidadMaxima = 99;

function validarVenta(req, res, next) {
  const { nombre, productos } = req.body ?? {};

  if (typeof nombre !== "string") {
    return res.status(400).json({ error: "El nombre del cliente es obligatorio." });
  }
  const nombreLimpio = nombre.trim().replace(/\s+/g, " ");
  if (nombreLimpio.length < nombreMin || nombreLimpio.length > nombreMax) {
    return res.status(400).json({ error: `El nombre debe tener entre ${nombreMin} y ${nombreMax} caracteres.` });
  }
  if (!patronNombre.test(nombreLimpio)) {
    return res.status(400).json({ error: "El nombre solo puede tener letras y espacios." });
  }

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "La venta debe tener al menos un producto." });
  }
  if (productos.length > lineasMaximas) {
    return res.status(400).json({ error: `La venta puede tener hasta ${lineasMaximas} productos distintos.` });
  }

  const lineas = [];
  const vistos = new Set();
  for (const item of productos) {
    const id = item?.id;
    const cantidad = item?.cantidad;
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Cada producto necesita un id entero mayor a 0." });
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > cantidadMaxima) {
      return res.status(400).json({ error: `La cantidad de cada producto debe ser un entero entre 1 y ${cantidadMaxima}.` });
    }
    if (vistos.has(id)) {
      return res.status(400).json({ error: `El producto ${id} está repetido en la venta.` });
    }
    vistos.add(id);
    lineas.push({ id, cantidad });
  }

  req.venta = { nombre: nombreLimpio, lineas };
  next();
}

module.exports = { validarVenta };
