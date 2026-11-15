// Muestra las vistas EJS del panel de administración; lo usa panelRutas.js.
const { Producto, tiposProducto, nombresTipo } = require("../modelos/producto");
const { formatearPrecio } = require("../utilidades/formato");

const iconosTipo = { ssd: "iconoSsd", procesadores: "iconoProcesador" };

function mostrarLogin(req, res) {
  res.render("login");
}

async function mostrarDashboard(req, res) {
  const productos = await Producto.findAll({ order: [["id", "ASC"]] });
  const secciones = tiposProducto.map((tipo) => ({
    nombre: nombresTipo[tipo] ?? tipo,
    icono: iconosTipo[tipo] ?? "iconoProductos",
    productos: productos.filter((producto) => producto.tipo === tipo),
  }));
  res.render("dashboard", { secciones, formatearPrecio });
}

module.exports = { mostrarLogin, mostrarDashboard };
