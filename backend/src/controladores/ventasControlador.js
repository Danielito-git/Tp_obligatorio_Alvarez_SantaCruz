// Guarda las ventas del cliente, las lista con sus productos y genera su ticket en PDF; lo usa ventasRutas.js.
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const sequelize = require("../baseDeDatos/conexion");
const { Producto, Venta, DetalleVenta } = require("../modelos/asociaciones");
const { nombresTipo } = require("../modelos/producto");
const { formatearPrecio, formatearFecha } = require("../utilidades/formato");
const { generarPdf } = require("../utilidades/generarPdf");

const aCentavos = (valor) => Math.round(valor * 100);

const plantillaTicket = path.join(__dirname, "..", "vistas", "ticketPdf.ejs");
const logo = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(__dirname, "..", "..", "publico", "img", "logo.svg"))
  .toString("base64")}`;

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

// Trae los productos de cada venta con los datos guardados al comprar (cantidad, precio y nombre de ese momento).
const conProductos = {
  model: Producto,
  as: "productos",
  attributes: ["id", "tipo"],
  through: { attributes: ["cantidad", "precioUnitario", "nombreProducto"] },
};
const productosPorId = [{ model: Producto, as: "productos" }, "id", "ASC"];

function lineasDeVenta(venta) {
  return venta.productos.map((producto) => {
    const { cantidad, precioUnitario, nombreProducto } = producto.DetalleVenta;
    return {
      id: producto.id,
      nombre: nombreProducto,
      tipo: producto.tipo,
      precio: precioUnitario,
      cantidad,
      subtotal: (aCentavos(precioUnitario) * cantidad) / 100,
    };
  });
}

function ventaARespuesta(venta) {
  return {
    id: venta.id,
    nombre: venta.nombreCliente,
    fecha: venta.fecha,
    total: venta.total,
    productos: lineasDeVenta(venta),
  };
}

async function buscarVenta(id) {
  return Venta.findByPk(id, { include: conProductos, order: [productosPorId] });
}

async function listarVentas(req, res, next) {
  try {
    const { pagina, limite } = req.listado;
    const total = await Venta.count();
    const totalPaginas = Math.max(1, Math.ceil(total / limite));
    const paginaValida = Math.min(pagina, totalPaginas);

    const ventas = await Venta.findAll({
      include: conProductos,
      order: [["fecha", "DESC"], ["id", "DESC"], productosPorId],
      limit: limite,
      offset: (paginaValida - 1) * limite,
    });

    res.json({ ventas: ventas.map(ventaARespuesta), pagina: paginaValida, totalPaginas, total });
  } catch (error) {
    next(error);
  }
}

async function obtenerVenta(req, res, next) {
  try {
    const venta = await buscarVenta(req.idVenta);
    if (!venta) {
      return res.status(404).json({ error: "No existe una venta con ese número." });
    }
    res.json(ventaARespuesta(venta));
  } catch (error) {
    next(error);
  }
}

async function descargarTicket(req, res, next) {
  try {
    const venta = await buscarVenta(req.idVenta);
    if (!venta) {
      return res.status(404).json({ error: "No existe una venta con ese número." });
    }

    const lineas = lineasDeVenta(venta).map((linea) => ({
      id: linea.id,
      nombre: linea.nombre,
      categoria: nombresTipo[linea.tipo] ?? linea.tipo,
      cantidad: linea.cantidad,
      precio: formatearPrecio(linea.precio),
      subtotal: formatearPrecio(linea.subtotal),
    }));

    const html = await ejs.renderFile(plantillaTicket, {
      empresa: "Technologia S.A.",
      logo,
      venta: {
        id: venta.id,
        nombre: venta.nombreCliente,
        fecha: formatearFecha(venta.fecha),
        total: formatearPrecio(venta.total),
      },
      lineas,
    });
    const pdf = await generarPdf(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="ticket-venta-${venta.id}.pdf"`,
    });
    res.send(pdf);
  } catch (error) {
    next(error);
  }
}

module.exports = { crearVenta, listarVentas, obtenerVenta, descargarTicket };
