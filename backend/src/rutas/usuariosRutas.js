// Rutas de /api/usuarios; las monta app.js.
const { Router } = require("express");
<<<<<<< HEAD
=======
const { exigirAdminApi } = require("../middlewares/sesion");
>>>>>>> origin/Rama-daniel
const { validarUsuario } = require("../middlewares/validarUsuarios");
const { crearUsuario } = require("../controladores/usuariosControlador");

const router = Router();

<<<<<<< HEAD
router.post("/", validarUsuario, crearUsuario);
=======
router.post("/", exigirAdminApi, validarUsuario, crearUsuario);
>>>>>>> origin/Rama-daniel

module.exports = router;
