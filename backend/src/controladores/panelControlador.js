// Muestra las vistas EJS del panel de administración y maneja el login y el cierre de sesion.
const bcrypt = require("bcrypt");
const { Producto, tiposProducto, nombresTipo } = require("../modelos/producto");
const { Usuario } = require("../modelos/usuario");
const { nombreCookie, opcionesBase, opcionesCookie, crearToken } = require("../utilidades/token");
const { formatearPrecio } = require("../utilidades/formato");

const iconosTipo = { ssd: "iconoSsd", procesadores: "iconoProcesador" };

function mostrarLogin(req, res) {
  // Para no pedir sesion otra vez
  if (req.admin) return res.redirect("/admin/dashboard");
  res.render("login", { error: null, correo: "" });
}

async function iniciarSesion(req, res, next) {
  try {
    const { correo, contrasenia } = req.credenciales;
    const usuario = await Usuario.findOne({ where: { correo } });
    const correcta = usuario ? await bcrypt.compare(contrasenia, usuario.contraseniaHash) : false;

    if (!correcta) {
      // Mensaje de error
      return res.status(401).render("login", { error: "Correo o contraseña incorrectos.", correo });
    }

    res.cookie(nombreCookie, crearToken(usuario), opcionesCookie);
    res.redirect("/admin/dashboard");
  } catch (error) {
    next(error);
  }
}

function cerrarSesion(req, res) {
  res.clearCookie(nombreCookie, opcionesBase);
  res.redirect("/login");
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

module.exports = { mostrarLogin, iniciarSesion, cerrarSesion, mostrarDashboard };