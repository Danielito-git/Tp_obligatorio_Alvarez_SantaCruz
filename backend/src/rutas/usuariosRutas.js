// Rutas de /api/usuarios; las monta app.js.
const { Router } = require("express");
const { exigirAdminApi } = require("../middlewares/sesion");
const { validarUsuario } = require("../middlewares/validarUsuarios");
const { crearUsuario } = require("../controladores/usuariosControlador");

const router = Router();

router.post("/", exigirAdminApi, validarUsuario, crearUsuario);

module.exports = router;
