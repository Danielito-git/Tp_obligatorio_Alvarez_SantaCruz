// Lee la sesion del administrador desde la cookie y protege las rutas /admin; lo usa panelRutas.js.
const { nombreCookie, leerToken } = require("../utilidades/token");

function cargarSesion(req, res, next) {
  const datos = leerToken(req.cookies?.[nombreCookie]);
  req.admin = datos ? { id: datos.id, correo: datos.correo } : null;
  res.locals.admin = req.admin;
  next();
}

// Se ejecuta solo en /admin/*: si no hay sesion valida, vuelve al login.
function verificarAdmin(req, res, next) {
  if (!req.admin) return res.redirect("/login");
  next();
}

module.exports = { cargarSesion, verificarAdmin };
