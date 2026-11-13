// Rutas de la API de ventas del cliente; las monta app.js en /api/ventas.
const { Router } = require("express");
const { validarVenta } = require("../middlewares/validarVentas");
const { crearVenta } = require("../controladores/ventasControlador");

const router = Router();

router.post("/", validarVenta, crearVenta);

module.exports = router;
