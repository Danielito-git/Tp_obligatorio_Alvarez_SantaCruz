// Carga los productos de ejemplo que todavía no están en la tabla (los compara por nombre); se ejecuta con npm run cargarProductos.
require("../entorno");
const sequelize = require("../baseDeDatos/conexion");
const { Producto } = require("../modelos/producto");
const productosEjemplo = require("./productosEjemplo.json");

async function cargarProductos() {
  await sequelize.sync();

  const existentes = await Producto.findAll({ attributes: ["nombre"] });
  const nombres = new Set(existentes.map((producto) => producto.nombre));
  const faltantes = productosEjemplo.filter((producto) => !nombres.has(producto.nombre));

  if (faltantes.length === 0) {
    console.log(`La tabla productos ya tiene los ${productosEjemplo.length} productos de ejemplo; no se cargó nada.`);
    return;
  }

  await Producto.bulkCreate(faltantes, { validate: true });
  console.log(`Se cargaron ${faltantes.length} productos de ejemplo nuevos.`);
}

cargarProductos()
  .catch((error) => {
    console.error("No se pudieron cargar los productos:", error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
