// Crea la base de datos del .env si todavía no existe; se ejecuta una vez con npm run crearBase.
require("../entorno");
const mysql = require("mysql2/promise");

async function crearBase() {
  const conexion = await mysql.createConnection({
    host: process.env.dbHost,
    port: Number(process.env.dbPuerto ?? 3306),
    user: process.env.dbUsuario,
    password: process.env.dbClave,
  });
  try {
    await conexion.query(
      `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(process.env.dbNombre)} CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
    );
    console.log(`Base de datos "${process.env.dbNombre}" lista.`);
  } finally {
    await conexion.end();
  }
}

crearBase().catch((error) => {
  console.error("No se pudo crear la base de datos:", error.message);
  process.exit(1);
});
