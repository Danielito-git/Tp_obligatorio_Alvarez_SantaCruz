// Rutas de las paginas del panel de administracion (HTML con EJS); las monta app.js.
const { Router } = require("express");
const { cargarSesion, verificarAdmin } = require("../middlewares/sesion");
const { validarLogin } = require("../middlewares/validarUsuarios");
<<<<<<< HEAD
const { mostrarLogin, iniciarSesion, cerrarSesion, mostrarDashboard, mostrarAlta, mostrarEdicion } = require("../controladores/panelControlador");
=======
const {
  mostrarLogin,
  iniciarSesion,
  cerrarSesion,
  mostrarDashboard,
  mostrarAlta,
  mostrarEdicion,
  mostrarUsuarios,
} = require("../controladores/panelControlador");
>>>>>>> origin/Rama-daniel

const router = Router();

router.use(cargarSesion);

router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.post("/logout", cerrarSesion);

// Todo lo que cuelga de /admin exige sesion: verificarAdmin va antes que las rutas que protege.
router.use("/admin", verificarAdmin);
router.get("/admin/dashboard", mostrarDashboard);
router.get("/admin/productos/nuevo", mostrarAlta);
router.get("/admin/productos/:id/editar", mostrarEdicion);
<<<<<<< HEAD
=======
router.get("/admin/usuarios", mostrarUsuarios);
>>>>>>> origin/Rama-daniel

module.exports = router;
