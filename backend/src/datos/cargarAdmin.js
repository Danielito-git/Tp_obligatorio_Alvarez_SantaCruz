// Crea el administrador del acceso rapido si todavía no existe. Ejecutar como npm run cargarAdmin.
require("../entorno");
const bcrypt = require("bcrypt");
const sequelize = require("../baseDeDatos/conexion");
const { Usuario } = require("../modelos/usuario");
const { rondasBcrypt } = require("../controladores/usuariosControlador");
const adminRapido = require("./adminRapido");

async function cargarAdmin() {
  await sequelize.sync();

  const existente = await Usuario.findOne({ where: { correo: adminRapido.correo } });
  if (existente) {
    console.log(`El administrador ${adminRapido.correo} ya existe; no se cargó nada.`);
    return;
  }

  const contraseniaHash = await bcrypt.hash(adminRapido.contrasenia, rondasBcrypt);
  await Usuario.create({ correo: adminRapido.correo, contraseniaHash });
  console.log(`Administrador creado: ${adminRapido.correo} / ${adminRapido.contrasenia}`);
}

cargarAdmin()
  .catch((error) => {
    console.error("No se pudo cargar el administrador:", error.message);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
