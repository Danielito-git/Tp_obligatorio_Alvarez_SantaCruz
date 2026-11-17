// Valida los parámetros y los datos de las rutas de productos; lo usa productosRutas.js.
const { tiposProducto, atributosPorTipo } = require("../modelos/producto");
const { borrarImagenSubida } = require("../utilidades/imagenes");

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

const nombreMax = 120;
const textoMax = 60;
const precioMax = 100000000;
const patronPrecio = /^\d+(\.\d{1,2})?$/;
const patronEntero = /^\d+$/;
const patronDecimal = /^\d+(\.\d+)?$/;


const descripcionAtributo = {
  texto: `un texto de hasta ${textoMax} caracteres`,
  entero: "un número entero mayor a 0",
  decimal: "un número mayor a 0",
  booleano: "Sí o No",
};


function convertirAtributo(definicion, valor) {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim();

  switch (definicion.tipo) {
    case "texto":
      return limpio.length > 0 && limpio.length <= textoMax ? limpio : null;
    case "entero":
      return patronEntero.test(limpio) && Number(limpio) > 0 ? Number(limpio) : null;
    case "decimal":
      return patronDecimal.test(limpio) && Number(limpio) > 0 ? Number(limpio) : null;
    case "booleano":
      if (limpio === "true") return true;
      if (limpio === "false") return false;
      return null;
    default:
      return null;
  }
}

function validarAtributos(tipo, enviados) {
  const recibidos = enviados ?? {};
  const atributos = {};

  for (const definicion of atributosPorTipo[tipo]) {
    const valor = convertirAtributo(definicion, recibidos[definicion.clave]);
    if (valor === null) {
      return { error: `El atributo "${definicion.nombre}" es obligatorio y debe ser ${descripcionAtributo[definicion.tipo]}.` };
    }
    atributos[definicion.clave] = valor;
  }
  return { atributos };
}

function rechazarProducto(req, res, mensaje) {
  borrarImagenSubida(req.file);
  return res.status(400).json({ error: mensaje });
}


function validarProductoNuevo(req, res, next) {
  const { nombre, precio, tipo, atributos } = req.body ?? {};

  if (typeof nombre !== "string" || !nombre.trim() || nombre.trim().length > nombreMax) {
    return rechazarProducto(req, res, `El nombre es obligatorio y puede tener hasta ${nombreMax} caracteres.`);
  }
  if (typeof precio !== "string" || !patronPrecio.test(precio.trim()) || Number(precio) <= 0 || Number(precio) > precioMax) {
    return rechazarProducto(req, res, "El precio debe ser un número mayor a 0, con hasta 2 decimales.");
  }
  if (!tiposProducto.includes(tipo)) {
    return rechazarProducto(req, res, `El tipo debe ser uno de: ${tiposProducto.join(", ")}.`);
  }
  if (!req.file) {
    return rechazarProducto(req, res, "La imagen del producto es obligatoria.");
  }

  const resultado = validarAtributos(tipo, atributos);
  if (resultado.error) {
    return rechazarProducto(req, res, resultado.error);
  }

  req.productoNuevo = {
    nombre: nombre.trim(),
    precio: Number(precio),
    tipo,
    imagen: `imagenes/productos/${req.file.filename}`,
    atributos: resultado.atributos,
  };
  next();
}

module.exports = { validarListado, validarId, validarProductoNuevo };
