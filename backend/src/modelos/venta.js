// Modelo de la tabla ventas (cliente, fecha y total); lo relaciona asociaciones.js.
const { DataTypes } = require("sequelize");
const sequelize = require("../baseDeDatos/conexion");

const Venta = sequelize.define(
  "Venta",
  {
    nombreCliente: {
      type: DataTypes.STRING(30),
      allowNull: false,
      validate: { notEmpty: true },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
      get() {
        return Number(this.getDataValue("total"));
      },
    },
  },
  { tableName: "ventas" }
);

module.exports = { Venta };
