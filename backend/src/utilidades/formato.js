// Formatea precios y fechas como en la tienda (es-AR); lo usan panelControlador.js y ventasControlador.js.
const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatoFecha = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
});

function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

function formatearFecha(fecha) {
  return formatoFecha.format(new Date(fecha));
}

module.exports = { formatearPrecio, formatearFecha };
