// Carga los productos de ejemplo si la tabla está vacía; se ejecuta con npm run cargarProductos.
require("../entorno");
const sequelize = require("../baseDeDatos/conexion");
const { Producto } = require("../modelos/producto");
const productosEjemplo = require("./productosEjemplo.json");

async function cargarProductos() {
  await sequelize.sync();

  const cantidad = await Producto.count();
  if (cantidad > 0) {
    console.log(`La tabla productos ya tiene ${cantidad} productos; no se cargó nada.`);
    return;
  }

  await Producto.bulkCreate(productosEjemplo, { validate: true });
  console.log(`Se cargaron ${productosEjemplo.length} productos de ejemplo.`);
}

cargarProductos()
  .catch((error) => {
    console.error("No se pudieron cargar los productos:", error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
