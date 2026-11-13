// Conexión a MySQL con Sequelize; la usan los modelos, app.js y cargarProductos.js.
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.dbNombre, process.env.dbUsuario, process.env.dbClave, {
  host: process.env.dbHost,
  port: Number(process.env.dbPuerto ?? 3306),
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
