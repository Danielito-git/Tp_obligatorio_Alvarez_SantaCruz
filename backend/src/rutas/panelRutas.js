// Rutas de las páginas del panel de administración (HTML con EJS); las monta app.js.
const { Router } = require("express");
const { mostrarLogin, mostrarDashboard } = require("../controladores/panelControlador");

const router = Router();

router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", mostrarLogin);
router.get("/admin/dashboard", mostrarDashboard);

module.exports = router;
