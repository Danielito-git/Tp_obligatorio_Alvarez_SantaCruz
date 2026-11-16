// Rutas de la API de ventas: crear, listar con sus productos, ver una y descargar su ticket; las monta app.js en /api/ventas.
const { Router } = require("express");
const { validarVenta, validarIdVenta, validarListadoVentas } = require("../middlewares/validarVentas");
const {
  crearVenta,
  listarVentas,
  obtenerVenta,
  descargarTicket,
} = require("../controladores/ventasControlador");

const router = Router();

router.get("/", validarListadoVentas, listarVentas);
router.post("/", validarVenta, crearVenta);
router.get("/:id", validarIdVenta, obtenerVenta);
router.get("/:id/ticket", validarIdVenta, descargarTicket);

module.exports = router;
