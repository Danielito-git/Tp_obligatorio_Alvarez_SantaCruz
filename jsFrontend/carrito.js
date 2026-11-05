// Lógica de la pantalla de carrito (carrito.html).
import { config } from "./config.js";
import { formatearPrecio } from "./formato.js";
import { crearIcono, montarLayout } from "./layout.js";
import {
  obtenerNombre,
  obtenerCarrito,
  agregarAlCarrito,
  restarDelCarrito,
  quitarDelCarrito,
  totalCarrito,
  totalUnidades,
  confirmarCompra,
} from "./sesion.js";

const nombre = obtenerNombre();

const elementos = {
  lista: document.getElementById("lineasCarrito"),
  vacio: document.getElementById("carritoVacio"),
  unidades: document.getElementById("resumenUnidades"),
  total: document.getElementById("resumenTotal"),
  botonConfirmar: document.getElementById("botonConfirmar"),
  modal: document.getElementById("modalConfirmar"),
  textoModal: document.getElementById("textoModal"),
  botonCancelar: document.getElementById("botonCancelar"),
  botonAceptar: document.getElementById("botonAceptar"),
};

function iniciar() {
  montarLayout({ titulo: "Carrito", pantalla: "carrito" });
  document.getElementById("saludo").textContent = `${nombre}, revisá tu compra antes de confirmarla.`;

  pintarCarrito();
  elementos.botonConfirmar.addEventListener("click", abrirModal);
  elementos.botonCancelar.addEventListener("click", () => elementos.modal.close());
  elementos.botonAceptar.addEventListener("click", finalizarCompra);
}

function pintarCarrito() {
  const carrito = obtenerCarrito();
  const vacio = carrito.length === 0;

  elementos.lista.replaceChildren(...carrito.map(crearLinea));
  elementos.lista.hidden = vacio;
  elementos.vacio.hidden = !vacio;
  elementos.unidades.textContent = totalUnidades();
  elementos.total.textContent = formatearPrecio(totalCarrito());
  elementos.botonConfirmar.disabled = vacio;
}

function crearLinea(item) {
  const linea = document.createElement("li");
  linea.className = "lineaCarrito";
  linea.dataset.id = item.id;

  const imagen = document.createElement("img");
  imagen.className = "lineaImagen";
  imagen.src = item.imagen;
  imagen.alt = item.nombre;
  imagen.width = 88;
  imagen.height = 88;

  const info = document.createElement("div");
  info.className = "lineaInfo";
  const datos = document.createElement("p");
  datos.className = "productoDatos";
  const categoria = config.categorias.find((c) => c.id === item.tipo);
  datos.textContent = `${categoria ? categoria.nombre : item.tipo} · Cód. ${item.id}`;
  const titulo = document.createElement("h2");
  titulo.className = "productoNombre";
  titulo.textContent = item.nombre;
  const precio = document.createElement("p");
  precio.className = "lineaPrecio";
  precio.textContent = `${formatearPrecio(item.precio)} c/u`;
  info.append(datos, titulo, precio);

  const contador = document.createElement("div");
  contador.className = "contador";
  const restar = crearBoton("restar", "contadorBoton", "iconoMenos", `Quitar una unidad de ${item.nombre}`);
  const valor = document.createElement("output");
  valor.className = "contadorValor";
  valor.setAttribute("aria-live", "polite");
  valor.textContent = item.cantidad;
  const sumar = crearBoton("sumar", "contadorBoton", "iconoMas", `Agregar una unidad de ${item.nombre}`);
  contador.append(restar, valor, sumar);

  const subtotal = document.createElement("p");
  subtotal.className = "lineaSubtotal";
  subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

  const quitar = crearBoton("quitar", "botonPlano", "iconoQuitar", `Quitar ${item.nombre} del carrito`);
  quitar.append("Quitar");

  linea.append(imagen, info, contador, subtotal, quitar);

  linea.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const accion = boton.dataset.accion;
    if (accion === "sumar") agregarAlCarrito(item);
    else if (accion === "restar") restarDelCarrito(item.id);
    else if (accion === "quitar") quitarDelCarrito(item.id);

    pintarCarrito();
    devolverFoco(item.id, accion);
  });

  return linea;
}

function crearBoton(accion, clase, icono, etiqueta) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = clase;
  boton.dataset.accion = accion;
  boton.setAttribute("aria-label", etiqueta);
  boton.append(crearIcono(icono));
  return boton;
}

function devolverFoco(idProducto, accion) {
  const boton =
    elementos.lista.querySelector(`[data-id="${idProducto}"] [data-accion="${accion}"]`) ||
    elementos.lista.querySelector("[data-accion]") ||
    document.querySelector(".resumen a");
  boton.focus();
}

function abrirModal() {
  if (obtenerCarrito().length === 0) return;
  const unidades = totalUnidades();
  elementos.textoModal.textContent =
    `Vas a comprar ${unidades} ${unidades === 1 ? "unidad" : "unidades"} por un total de ${formatearPrecio(totalCarrito())}.`;
  elementos.modal.showModal();
}

function finalizarCompra() {
  if (obtenerCarrito().length === 0) {
    elementos.modal.close();
    return;
  }
  elementos.botonAceptar.disabled = true;
  confirmarCompra();
  window.location.href = "ticket.html";
}

if (!nombre) {
  window.location.replace("index.html");
} else {
  iniciar();
}
