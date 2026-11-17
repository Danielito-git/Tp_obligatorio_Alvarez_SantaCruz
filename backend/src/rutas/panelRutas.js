// Rutas de las páginas del panel de administración (HTML con EJS); las monta app.js.
const { Router } = require("express");
const { cargarSesion, verificarAdmin } = require("../middlewares/sesion");
const { validarLogin } = require("../middlewares/validarUsuarios");
const { mostrarLogin, iniciarSesion, cerrarSesion, mostrarDashboard, mostrarAlta } = require("../controladores/panelControlador");

const router = Router();

router.use(cargarSesion);

router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", mostrarLogin);
router.post("/login", validarLogin, iniciarSesion);
router.post("/logout", cerrarSesion);

// Todo lo que cuelga de /admin exige sesión: verificarAdmin va antes que las rutas que protege.
router.use("/admin", verificarAdmin);
router.get("/admin/dashboard", mostrarDashboard);
router.get("/admin/productos/nuevo", mostrarAlta);

module.exports = router;