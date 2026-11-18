// Muestra las vistas EJS del panel de administracion y maneja el login y el cierre de sesion; lo usa panelRutas.js.
const bcrypt = require("bcrypt");
const { Producto, tiposProducto, nombresTipo, atributosPorTipo } = require("../modelos/producto");
const { Usuario } = require("../modelos/usuario");
const { nombreCookie, opcionesBase, opcionesCookie, crearToken } = require("../utilidades/token");
<<<<<<< HEAD
const { formatearPrecio } = require("../utilidades/formato");
=======
const { formatearPrecio, formatearFecha } = require("../utilidades/formato");
>>>>>>> origin/Rama-daniel

const iconosTipo = { ssd: "iconoSsd", procesadores: "iconoProcesador" };

function mostrarLogin(req, res) {
  if (req.admin) return res.redirect("/admin/dashboard");
  res.render("login", { error: null, correo: "" });
}

async function iniciarSesion(req, res, next) {
  try {
    const { correo, contrasenia } = req.credenciales;
    const usuario = await Usuario.findOne({ where: { correo } });
    const correcta = usuario ? await bcrypt.compare(contrasenia, usuario.contraseniaHash) : false;

    if (!correcta) {
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

function mostrarAlta(req, res) {
  res.render("formularioProducto", { producto: null, tiposProducto, nombresTipo, atributosPorTipo });
}

async function mostrarEdicion(req, res) {
  const id = Number(req.params.id);
  const producto = Number.isInteger(id) && id > 0 ? await Producto.findByPk(id) : null;
  if (!producto) return res.redirect("/admin/dashboard");
  res.render("formularioProducto", { producto, tiposProducto, nombresTipo, atributosPorTipo });
}

<<<<<<< HEAD
module.exports = { mostrarLogin, iniciarSesion, cerrarSesion, mostrarDashboard, mostrarAlta, mostrarEdicion };
=======
async function mostrarUsuarios(req, res, next) {
  try {
    const usuarios = await Usuario.findAll({ attributes: ["id", "correo", "createdAt"], order: [["id", "ASC"]] });
    res.render("usuarios", { usuarios, formatearFecha });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  mostrarLogin,
  iniciarSesion,
  cerrarSesion,
  mostrarDashboard,
  mostrarAlta,
  mostrarEdicion,
  mostrarUsuarios,
};
>>>>>>> origin/Rama-daniel
