// Formatea precios y atributos de los productos; lo usa productos.js.
const formatoPesos = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return formatoPesos.format(valor);
}

export function formatearAtributo(valor, unidad) {
    
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  const texto = typeof valor === "number" ? valor.toLocaleString("es-AR") : valor;
  return unidad ? `${texto} ${unidad}` : texto;}