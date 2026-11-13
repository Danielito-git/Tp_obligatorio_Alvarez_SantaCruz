// Lógica de la pantalla de bienvenida (index.html).
import { config } from "./config.js";
import { crearIcono, montarLayout } from "./layout.js";
import { guardarNombre, obtenerNombre } from "./sesion.js";
import { normalizarNombre, validarNombre } from "./validaciones.js";

montarLayout({ titulo: "Bienvenida", pantalla: "bienvenida" });

const formulario = document.getElementById("formNombre");
const campo = document.getElementById("nombre");
const error = document.getElementById("errorNombre");

document.getElementById("tituloBienvenida").textContent = `¡Bienvenido a ${config.nombreApp}!`;
mostrarCategorias();

campo.value = obtenerNombre() ?? "";
campo.focus({ preventScroll: true });

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombre = normalizarNombre(campo.value);
  const mensaje = validarNombre(nombre);
  if (mensaje) {
    mostrarError(mensaje);
    campo.focus();
    return;
  }

  guardarNombre(nombre);
  window.location.href = "productos.html";
});

campo.addEventListener("input", () => {
  if (error.hidden) return;
  const mensaje = validarNombre(normalizarNombre(campo.value));
  if (mensaje) mostrarError(mensaje);
  else ocultarError();
});

function mostrarError(mensaje) {
  error.textContent = mensaje;
  error.hidden = false;
  campo.setAttribute("aria-invalid", "true");
}

function ocultarError() {
  error.textContent = "";
  error.hidden = true;
  campo.removeAttribute("aria-invalid");
}

function mostrarCategorias() {
  const lista = document.getElementById("listaCategorias");
  lista.replaceChildren(
    ...config.categorias.map((categoria) => {
      const item = document.createElement("li");
      item.className = "chip";
      const texto = document.createElement("span");
      texto.textContent = categoria.nombre;
      item.append(crearIcono(categoria.icono), texto);
      return item;
    })
  );
}
