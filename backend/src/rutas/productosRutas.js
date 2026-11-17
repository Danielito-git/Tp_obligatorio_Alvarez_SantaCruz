// Rutas de /api/productos; lo usa app.js.
const express = require("express");
const { exigirAdminApi } = require("../middlewares/sesion");
const { subirImagen } = require("../middlewares/subirImagen");
const { validarListado, validarId, validarProductoNuevo } = require("../middlewares/validarProductos");
const { listarProductos, obtenerProducto, crearProducto } = require("../controladores/productosControlador");

const router = express.Router();

router.get("/", validarListado, listarProductos);
router.get("/:id", validarId, obtenerProducto);
router.post("/", exigirAdminApi, subirImagen, validarProductoNuevo, crearProducto);

module.exports = router;
