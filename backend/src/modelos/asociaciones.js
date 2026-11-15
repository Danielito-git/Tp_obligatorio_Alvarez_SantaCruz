// Relación muchos a muchos entre productos y ventas a través de DetalleVenta; la usan los controladores de ventas.
const { Producto } = require("./producto");
const { Venta } = require("./venta");
const { DetalleVenta } = require("./detalleVenta");

Venta.belongsToMany(Producto, { through: DetalleVenta, foreignKey: "ventaId", otherKey: "productoId", as: "productos" });
Producto.belongsToMany(Venta, { through: DetalleVenta, foreignKey: "productoId", otherKey: "ventaId", as: "ventas" });

module.exports = { Producto, Venta, DetalleVenta };
