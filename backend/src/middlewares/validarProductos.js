// Valida los parámetros de las rutas de productos; lo usa productosRutas.js.
const { tiposProducto } = require("../modelos/producto");

const limiteMaximo = 50;

function enteroPositivo(valor) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

function validarListado(req, res, next) {
  const { tipo, pagina = "1", limite = "6" } = req.query;

  if (tipo !== undefined && !tiposProducto.includes(tipo)) {
    return res.status(400).json({ error: `El tipo debe ser uno de: ${tiposProducto.join(", ")}.` });
  }

  const numeroPagina = enteroPositivo(pagina);
  if (numeroPagina === null) {
    return res.status(400).json({ error: "La página debe ser un número entero mayor a 0." });
  }

  const numeroLimite = enteroPositivo(limite);
  if (numeroLimite === null || numeroLimite > limiteMaximo) {
    return res.status(400).json({ error: `El límite debe ser un número entero entre 1 y ${limiteMaximo}.` });
  }

  req.listado = { tipo, pagina: numeroPagina, limite: numeroLimite };
  next();
}

function validarId(req, res, next) {
  const id = enteroPositivo(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: "El id debe ser un número entero mayor a 0." });
  }
  req.idProducto = id;
  next();
}

module.exports = { validarListado, validarId };
