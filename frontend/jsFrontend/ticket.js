// Lógica de la pantalla de ticket (ticket.html).
import { config } from "./config.js";
import { descargarTicket } from "./api.js";
import { formatearFecha, formatearPrecio } from "./formato.js";
import { montarLayout } from "./layout.js";
import { obtenerCompra, obtenerNombre, reiniciarCompra } from "./sesion.js";

const compra = obtenerCompra();

function iniciar() {
  montarLayout({ titulo: "Ticket", pantalla: "ticket" });

  document.getElementById("ticketEmpresa").textContent = config.empresa;
  document.getElementById("ticketNumero").textContent = compra.id ?? "-";
  document.getElementById("ticketCliente").textContent = compra.nombre;
  document.getElementById("ticketFecha").textContent = formatearFecha(compra.fecha);
  document.getElementById("ticketLineas").replaceChildren(...compra.productos.map(crearFila));
  document.getElementById("ticketTotal").textContent = formatearPrecio(compra.total);

  const botonDescargar = document.getElementById("botonDescargar");
  botonDescargar.hidden = !compra.id;
  botonDescargar.addEventListener("click", () => bajarPdf(botonDescargar));

  document.getElementById("botonSalir").addEventListener("click", () => {
    reiniciarCompra();
    window.location.replace("index.html");
  });
}

async function bajarPdf(boton) {
  const texto = boton.querySelector(".botonTexto");
  const error = document.getElementById("errorTicket");
  boton.disabled = true;
  texto.textContent = "Generando PDF…";
  error.hidden = true;

  try {
    const pdf = await descargarTicket(compra.id);
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(pdf);
    enlace.download = `ticket-venta-${compra.id}.pdf`;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 1000);
  } catch (problema) {
    error.textContent = problema.message;
    error.hidden = false;
  } finally {
    boton.disabled = false;
    texto.textContent = "Descargar PDF";
  }
}

function crearFila(item) {
  const fila = document.createElement("tr");

  const producto = document.createElement("td");
  const nombre = document.createElement("span");
  nombre.textContent = item.nombre;
  const datos = document.createElement("span");
  datos.className = "ticketCodigo";
  const categoria = config.categorias.find((c) => c.id === item.tipo);
  datos.textContent = `${categoria ? categoria.nombre : item.tipo} · Cód. ${item.id}`;
  producto.append(nombre, datos);

  fila.append(
    producto,
    crearCelda(item.cantidad),
    crearCelda(formatearPrecio(item.precio)),
    crearCelda(formatearPrecio(item.precio * item.cantidad))
  );
  return fila;
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

if (!compra) {
  window.location.replace(obtenerNombre() ? "productos.html" : "index.html");
} else {
  iniciar();
}
