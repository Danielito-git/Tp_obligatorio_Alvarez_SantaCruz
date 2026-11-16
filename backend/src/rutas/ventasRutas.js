// Rutas de la API de ventas del cliente; las monta app.js en /api/ventas.
const { Router } = require("express");
const { validarVenta, validarIdVenta } = require("../middlewares/validarVentas");
const { crearVenta, listarVentas, descargarTicket } = require("../controladores/ventasControlador");

const router = Router();

router.get("/", listarVentas);
router.post("/", validarVenta, crearVenta);
router.get("/:id/ticket", validarIdVenta, descargarTicket);

module.exports = router;