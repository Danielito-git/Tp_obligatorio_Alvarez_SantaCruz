// Lógica de los endpoints de productos del cliente; lo usa productosRutas.js.
const { Producto } = require("../modelos/producto");

function aRespuesta(producto, req) {
  const datos = producto.toJSON();
  return {
    id: datos.id,
    nombre: datos.nombre,
    precio: datos.precio,
    imagen: `${req.protocol}://${req.get("host")}/${datos.imagen}`,
    tipo: datos.tipo,
    activo: datos.activo,
    atributos: datos.atributos,
  };
}

async function listarProductos(req, res, next) {
  try {
    const { tipo, pagina, limite } = req.listado;
    const filtro = { activo: true };
    if (tipo) filtro.tipo = tipo;

    const total = await Producto.count({ where: filtro });
    const totalPaginas = Math.max(1, Math.ceil(total / limite));
    const paginaValida = Math.min(pagina, totalPaginas);

    const productos = await Producto.findAll({
      where: filtro,
      order: [["id", "ASC"]],
      limit: limite,
      offset: (paginaValida - 1) * limite,
    });

    res.json({
      productos: productos.map((producto) => aRespuesta(producto, req)),
      pagina: paginaValida,
      totalPaginas,
      total,
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerProducto(req, res, next) {
  try {
    const producto = await Producto.findOne({ where: { id: req.idProducto, activo: true } });
    if (!producto) {
      return res.status(404).json({ error: "No existe un producto activo con ese id." });
    }
    res.json(aRespuesta(producto, req));
  } catch (error) {
    next(error);
  }
}

module.exports = { listarProductos, obtenerProducto };
