// Tabla intermedia entre ventas y productos (cantidad, precio y nombre al momento de la compra); la relaciona asociaciones.js.
const { DataTypes } = require("sequelize");
const sequelize = require("../baseDeDatos/conexion");

const DetalleVenta = sequelize.define(
  "DetalleVenta",
  {
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
      get() {
        return Number(this.getDataValue("precioUnitario"));
      },
    },
    nombreProducto: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
  },
  { tableName: "detallesVenta" }
);

module.exports = { DetalleVenta };
