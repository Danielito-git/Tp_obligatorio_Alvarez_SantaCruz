// Modelo de la tabla productos; lo usan productosControlador.js y cargarProductos.js.
const { DataTypes } = require("sequelize");
const sequelize = require("../baseDeDatos/conexion");

const tiposProducto = ["ssd", "procesadores"];
const nombresTipo = { ssd: "Memorias SSD", procesadores: "Procesadores" };

const atributosPorTipo = {
  ssd: [
    { clave: "marca", nombre: "Marca", tipo: "texto" },
    { clave: "capacidad", nombre: "Capacidad", tipo: "texto" },
    { clave: "formato", nombre: "Formato", tipo: "texto" },
    { clave: "interfaz", nombre: "Interfaz", tipo: "texto" },
    { clave: "lectura", nombre: "Lectura", tipo: "entero", unidad: "MB/s" },
    { clave: "escritura", nombre: "Escritura", tipo: "entero", unidad: "MB/s" },
  ],
  procesadores: [
    { clave: "marca", nombre: "Marca", tipo: "texto" },
    { clave: "nucleos", nombre: "Núcleos", tipo: "entero" },
    { clave: "hilos", nombre: "Hilos", tipo: "entero" },
    { clave: "frecuenciaBase", nombre: "Frecuencia base", tipo: "decimal", unidad: "GHz" },
    { clave: "frecuenciaTurbo", nombre: "Frecuencia turbo", tipo: "decimal", unidad: "GHz" },
    { clave: "socket", nombre: "Socket", tipo: "texto" },
    { clave: "graficosIntegrados", nombre: "Gráficos integrados", tipo: "booleano" },
  ],
};

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

module.exports = { Producto, tiposProducto, nombresTipo, atributosPorTipo };