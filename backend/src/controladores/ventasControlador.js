// Guarda las ventas del cliente con precios tomados de la base; lo usa ventasRutas.js.
const sequelize = require("../baseDeDatos/conexion");
const { Producto, Venta, DetalleVenta } = require("../modelos/asociaciones");

const aCentavos = (valor) => Math.round(valor * 100);

async function crearVenta(req, res, next) {
  try {
    const { nombre, lineas } = req.venta;
    const ids = lineas.map((linea) => linea.id);

    const productos = await Producto.findAll({ where: { id: ids, activo: true } });
    const porId = new Map(productos.map((producto) => [producto.id, producto]));
    const noDisponibles = ids.filter((id) => !porId.has(id));
    if (noDisponibles.length > 0) {
      return res.status(409).json({
        error: "Algunos productos ya no están a la venta.",
        productosNoDisponibles: noDisponibles,
      });
    }

    const detalles = lineas.map(({ id, cantidad }) => {
      const producto = porId.get(id);
      return {
        productoId: id,
        cantidad,
        precioUnitario: producto.precio,
        nombreProducto: producto.nombre,
        tipo: producto.tipo,
        subtotal: (aCentavos(producto.precio) * cantidad) / 100,
      };
    });
    const total = detalles.reduce((suma, detalle) => suma + aCentavos(detalle.subtotal), 0) / 100;

    const venta = await sequelize.transaction(async (transaccion) => {
      const nueva = await Venta.create({ nombreCliente: nombre, total }, { transaction: transaccion });
      await DetalleVenta.bulkCreate(
        detalles.map(({ productoId, cantidad, precioUnitario, nombreProducto }) => ({
          ventaId: nueva.id,
          productoId,
          cantidad,
          precioUnitario,
          nombreProducto,
        })),
        { transaction: transaccion, validate: true }
      );
      return nueva;
    });

    res.status(201).json({
      id: venta.id,
      nombre: venta.nombreCliente,
      fecha: venta.fecha,
      total: venta.total,
      productos: detalles.map((detalle) => ({
        id: detalle.productoId,
        nombre: detalle.nombreProducto,
        tipo: detalle.tipo,
        precio: detalle.precioUnitario,
        cantidad: detalle.cantidad,
        subtotal: detalle.subtotal,
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { crearVenta };
