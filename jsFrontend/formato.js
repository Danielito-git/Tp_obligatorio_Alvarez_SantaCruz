// Formatea precios, atributos y fechas; lo usan productos.js, carrito.js y ticket.js.
const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

const formatoFecha = new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" });

export function formatearFecha(fechaIso) {
  return formatoFecha.format(new Date(fechaIso));
}

export function formatearAtributo(valor, unidad) {
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  const texto = typeof valor === "number" ? valor.toLocaleString("es-AR") : valor;
  return unidad ? `${texto} ${unidad}` : texto;
}
