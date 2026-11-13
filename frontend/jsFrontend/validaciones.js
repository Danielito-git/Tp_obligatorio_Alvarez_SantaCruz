// Reglas para validar el nombre del cliente; lo usa bienvenida.js.
export const nombreMin = 2;
export const nombreMax = 10;

const patronNombre = /^\p{L}[\p{L} '-]*$/u;

export function normalizarNombre(texto) {
  return texto.trim().replace(/\s+/g, " ");
}

export function validarNombre(nombre) {
  if (nombre.length === 0) return "Ingresá tu nombre para continuar.";
  if (nombre.length < nombreMin) return `El nombre debe tener al menos ${nombreMin} letras.`;
  if (nombre.length > nombreMax) return `El nombre puede tener hasta ${nombreMax} caracteres.`;
  if (!patronNombre.test(nombre)) return "Usá solo letras y espacios.";
  return null;
}
