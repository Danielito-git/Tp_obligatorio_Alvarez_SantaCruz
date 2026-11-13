// Rutas de /api/productos; lo usa app.js.
const express = require("express");
const { validarListado, validarId } = require("../middlewares/validarProductos");
const { listarProductos, obtenerProducto } = require("../controladores/productosControlador");

const router = express.Router();

router.get("/", validarListado, listarProductos);
router.get("/:id", validarId, obtenerProducto);

module.exports = router;
