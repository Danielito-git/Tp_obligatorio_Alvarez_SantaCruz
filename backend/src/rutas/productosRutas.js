// Rutas de /api/productos; lo usa app.js.
const express = require("express");
const { exigirAdminApi } = require("../middlewares/sesion");
const { subirImagen } = require("../middlewares/subirImagen");
const {
  validarListado,
  validarId,
  validarProductoNuevo,
  validarProductoEditado,
  validarEstado,
} = require("../middlewares/validarProductos");
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  editarProducto,
  cambiarEstado,
  eliminarProducto,
} = require("../controladores/productosControlador");

const router = express.Router();

router.get("/", validarListado, listarProductos);
router.get("/:id", validarId, obtenerProducto);

router.post("/", exigirAdminApi, subirImagen, validarProductoNuevo, crearProducto);
router.put("/:id", exigirAdminApi, validarId, subirImagen, validarProductoEditado, editarProducto);
router.patch("/:id/estado", exigirAdminApi, validarId, validarEstado, cambiarEstado);
router.delete("/:id", exigirAdminApi, validarId, eliminarProducto);

module.exports = router;
