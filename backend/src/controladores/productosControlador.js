// Lógica de los endpoints de productos (listado y detalle del cliente; alta, edición, estado y baja del administrador); lo usa productosRutas.js.
const { Op } = require("sequelize");
const { Producto, DetalleVenta } = require("../modelos/asociaciones");
const { borrarImagenSubida, borrarImagenGuardada } = require("../utilidades/imagenes");

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

async function crearProducto(req, res, next) {
  try {
    const producto = await Producto.create({ ...req.datosProducto, activo: true });
    res.status(201).json(aRespuesta(producto, req));
  } catch (error) {
    await borrarImagenSubida(req.file);
    next(error);
  }
}

async function borrarImagenSiNadieLaUsa(imagen, idProducto) {
  const otrosConLaMisma = await Producto.count({ where: { imagen, id: { [Op.ne]: idProducto } } });
  if (otrosConLaMisma === 0) await borrarImagenGuardada(imagen);
}

async function editarProducto(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.idProducto);
    if (!producto) {
      await borrarImagenSubida(req.file);
      return res.status(404).json({ error: "No existe un producto con ese id." });
    }

    const imagenAnterior = producto.imagen;
    await producto.update(req.datosProducto);

    // Con imagen nueva, la anterior ya no sirve para nada.
    if (req.file) await borrarImagenSiNadieLaUsa(imagenAnterior, producto.id);

    res.json(aRespuesta(producto, req));
  } catch (error) {
    await borrarImagenSubida(req.file);
    next(error);
  }
}

async function cambiarEstado(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.idProducto);
    if (!producto) {
      return res.status(404).json({ error: "No existe un producto con ese id." });
    }
    await producto.update({ activo: req.estadoNuevo });
    res.json(aRespuesta(producto, req));
  } catch (error) {
    next(error);
  }
}

async function eliminarProducto(req, res, next) {
  try {
    const producto = await Producto.findByPk(req.idProducto);
    if (!producto) {
      return res.status(404).json({ error: "No existe un producto con ese id." });
    }

    const ventas = await DetalleVenta.count({ where: { productoId: producto.id } });
    if (ventas > 0) {
      return res.status(409).json({
        error: "Este producto ya fue vendido, por eso no se puede eliminar. Desactivalo para sacarlo de la tienda.",
      });
    }

    await producto.destroy();
    await borrarImagenSiNadieLaUsa(producto.imagen, producto.id);
    res.json({ mensaje: "Producto eliminado.", id: producto.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarProductos, obtenerProducto, crearProducto, editarProducto, cambiarEstado, eliminarProducto };
