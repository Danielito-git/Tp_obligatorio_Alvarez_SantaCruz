// Modelo de la tabla usuarios (administradores del panel); lo usan usuariosControlador.js, panelControlador.js y cargarAdmin.js.
const { DataTypes } = require("sequelize");
const sequelize = require("../baseDeDatos/conexion");

const Usuario = sequelize.define(
  "Usuario",
  {
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    contraseniaHash: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
  },
  { tableName: "usuarios" }
);

module.exports = { Usuario };
