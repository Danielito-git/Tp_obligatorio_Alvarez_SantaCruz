// Cambia entre tema claro y oscuro y recuerda el elegido; lo usa el botón de tema de layout.js.
const claveTema = "autoservicioTema";

document.documentElement.dataset.tema = localStorage.getItem(claveTema) === "oscuro" ? "oscuro" : "claro";

export function temaActual() {
  return document.documentElement.dataset.tema;
}

export function alternarTema() {
  const nuevo = temaActual() === "oscuro" ? "claro" : "oscuro";
  document.documentElement.dataset.tema = nuevo;
  localStorage.setItem(claveTema, nuevo);
  return nuevo;
}
