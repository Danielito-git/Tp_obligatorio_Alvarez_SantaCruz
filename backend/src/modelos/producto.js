// Modelo de la tabla productos; lo usan productosControlador.js y cargarProductos.js.
const { DataTypes } = require("sequelize");
const sequelize = require("../baseDeDatos/conexion");

const tiposProducto = ["ssd", "procesadores"];

const Producto = sequelize.define(
  "Producto",
  {
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
      get() {
        return Number(this.getDataValue("precio"));
      },
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM(...tiposProducto),
      allowNull: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    atributos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  { tableName: "productos" }
);

module.exports = { Producto, tiposProducto };
