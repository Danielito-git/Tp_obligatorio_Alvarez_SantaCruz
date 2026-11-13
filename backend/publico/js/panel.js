// Aplica el tema claro u oscuro guardado y maneja el botón de tema; lo carga el encabezado del panel.
const claveTema = "technologiaTema";
const raiz = document.documentElement;

raiz.dataset.tema = localStorage.getItem(claveTema) === "oscuro" ? "oscuro" : "claro";

document.addEventListener("DOMContentLoaded", () => {
  const boton = document.getElementById("botonTema");
  const icono = boton.querySelector(".icono");

  const pintar = () => {
    const oscuro = raiz.dataset.tema === "oscuro";
    const etiqueta = oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    icono.className = `icono ${oscuro ? "iconoSol" : "iconoLuna"}`;
    boton.setAttribute("aria-label", etiqueta);
    boton.title = etiqueta;
  };
  pintar();

  boton.addEventListener("click", () => {
    raiz.dataset.tema = raiz.dataset.tema === "oscuro" ? "claro" : "oscuro";
    localStorage.setItem(claveTema, raiz.dataset.tema);
    pintar();
  });
});
