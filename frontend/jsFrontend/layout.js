// Arma el encabezado, el pie y los íconos de los botones de todas las pantallas.
import { config } from "./config.js";
import { alternarTema, temaActual } from "./tema.js";
import { totalUnidades, eventoCarrito } from "./sesion.js";

export function montarLayout({ titulo, pantalla }) {
  document.title = `${titulo} | ${config.nombreApp}`;

  document.getElementById("encabezado").replaceChildren(crearMarca(), crearNavegacion(pantalla));
  document.getElementById("pie").replaceChildren(crearPie());
}

function crearMarca() {
  const marca = document.createElement("div");
  marca.className = "marca";

  const logo = document.createElement("img");
  logo.src = "img/logo.svg";
  logo.alt = `Logo de ${config.nombreApp}`;
  logo.className = "marcaLogo";
  logo.width = 44;
  logo.height = 44;

  const textos = document.createElement("div");
  const nombre = document.createElement("span");
  nombre.className = "marcaNombre";
  nombre.textContent = config.nombreApp;
  const eslogan = document.createElement("span");
  eslogan.className = "marcaEslogan";
  eslogan.textContent = config.eslogan;
  textos.append(nombre, eslogan);

  marca.append(logo, textos);
  return marca;
}

function crearNavegacion(pantalla) {
  const nav = document.createElement("nav");
  nav.className = "navegacion";
  nav.setAttribute("aria-label", "Navegación principal");

  if (pantalla === "productos") {
    nav.append(crearEnlace("Inicio", "index.html", "iconoInicio"), crearEnlaceCarrito());
  } else if (pantalla === "carrito") {
    nav.append(crearEnlace("Inicio", "index.html", "iconoInicio"), crearEnlace("Productos", "productos.html", "iconoProductos"));
  }

  nav.append(crearBotonAdmin(), crearBotonTema());
  return nav;
}

function crearEnlace(texto, href, icono) {
  const enlace = document.createElement("a");
  enlace.className = "boton";
  enlace.href = href;
  enlace.append(crearIcono(icono), crearTexto(texto));
  return enlace;
}

function crearEnlaceCarrito() {
  const boton = document.createElement("a");
  boton.className = "boton botonCarrito";
  boton.href = "carrito.html";

  const insignia = document.createElement("span");
  insignia.className = "insignia";

  const actualizar = () => {
    const unidades = totalUnidades();
    insignia.textContent = unidades;
    insignia.hidden = unidades === 0;
    boton.setAttribute("aria-label", `Carrito: ${unidades} ${unidades === 1 ? "unidad" : "unidades"}`);
  };
  actualizar();
  window.addEventListener(eventoCarrito, actualizar);

  boton.append(crearIcono("iconoCarrito"), crearTexto("Carrito"), insignia);
  return boton;
}

function crearBotonAdmin() {
  const texto = "Administración";
  if (config.urlLoginAdmin) {
    return crearEnlace(texto, config.urlLoginAdmin, "iconoAdmin");
  }
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton";
  boton.disabled = true;
  boton.title = "Disponible cuando esté armado el backend";
  boton.append(crearIcono("iconoAdmin"), crearTexto(texto));
  return boton;
}

function crearBotonTema() {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton botonIcono";

  const pintar = () => {
    const oscuro = temaActual() === "oscuro";
    const etiqueta = oscuro ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
    boton.replaceChildren(crearIcono(oscuro ? "iconoSol" : "iconoLuna"));
    boton.setAttribute("aria-label", etiqueta);
    boton.title = etiqueta;
  };
  pintar();

  boton.addEventListener("click", () => {
    alternarTema();
    pintar();
  });
  return boton;
}

function crearTexto(texto) {
  const span = document.createElement("span");
  span.className = "botonTexto";
  span.textContent = texto;
  return span;
}

function crearPie() {
  const parrafo = document.createElement("p");
  parrafo.textContent = `${config.nombreApp} · Programación 3 · Alumnos: ${config.alumnos.join(", ")}`;
  return parrafo;
}

export function crearIcono(clase) {
  const icono = document.createElement("span");
  icono.className = `icono ${clase}`;
  icono.setAttribute("aria-hidden", "true");
  return icono;
}
