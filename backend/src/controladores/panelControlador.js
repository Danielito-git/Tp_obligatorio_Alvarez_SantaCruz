// Muestra las vistas EJS del panel de administración; lo usa panelRutas.js.
const { Producto, tiposProducto } = require("../modelos/producto");

const datosTipo = {
  ssd: { nombre: "Memorias SSD", icono: "iconoSsd" },
  procesadores: { nombre: "Procesadores", icono: "iconoProcesador" },
};

const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

function mostrarLogin(req, res) {
  res.render("login");
}

async function mostrarDashboard(req, res) {
  const productos = await Producto.findAll({ order: [["id", "ASC"]] });
  const secciones = tiposProducto.map((tipo) => ({
    nombre: datosTipo[tipo]?.nombre ?? tipo,
    icono: datosTipo[tipo]?.icono ?? "iconoProductos",
    productos: productos.filter((producto) => producto.tipo === tipo),
  }));
  res.render("dashboard", { secciones, formatearPrecio: (valor) => formatoPesos.format(valor) });
}

module.exports = { mostrarLogin, mostrarDashboard };
