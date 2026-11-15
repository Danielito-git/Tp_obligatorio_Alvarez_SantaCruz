// Servidor Express de Technologia: API en JSON para el cliente y panel de administración con EJS; se inicia con npm run dev.
require("./entorno");
const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./baseDeDatos/conexion");
const productosRutas = require("./rutas/productosRutas");
const ventasRutas = require("./rutas/ventasRutas");
const panelRutas = require("./rutas/panelRutas");
const { rutaNoEncontrada, manejarErrores } = require("./middlewares/errores");

const app = express();
const puerto = Number(process.env.puerto ?? 3000);
const origenesPermitidos = (process.env.origenesPermitidos ?? "")
  .split(",")
  .map((origen) => origen.trim())
  .filter(Boolean);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vistas"));
app.locals.urlTienda = process.env.urlTienda ?? "http://127.0.0.1:5500/frontend/index.html";

app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());
app.use("/imagenes", express.static(path.join(__dirname, "..", "imagenes")));
app.use(express.static(path.join(__dirname, "..", "publico")));

app.use("/api/productos", productosRutas);
app.use("/api/ventas", ventasRutas);
app.use("/api", rutaNoEncontrada);
app.use(panelRutas);
app.use(manejarErrores);

async function iniciar() {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(puerto, () => {
    console.log(`API de Technologia en http://localhost:${puerto}/api`);
    console.log(`Panel de administración en http://localhost:${puerto}/login`);
  });
}

iniciar().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});
