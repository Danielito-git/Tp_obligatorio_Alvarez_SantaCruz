// Lógica de la pantalla de ticket (ticket.html).
import { config } from "./config.js";
import { formatearFecha, formatearPrecio } from "./formato.js";
import { montarLayout } from "./layout.js";
import { obtenerCompra, obtenerNombre, reiniciarCompra } from "./sesion.js";

const compra = obtenerCompra();

function iniciar() {
  montarLayout({ titulo: "Ticket", pantalla: "ticket" });

  document.getElementById("ticketEmpresa").textContent = config.empresa;
  document.getElementById("ticketCliente").textContent = compra.nombre;
  document.getElementById("ticketFecha").textContent = formatearFecha(compra.fecha);
  document.getElementById("ticketLineas").replaceChildren(...compra.productos.map(crearFila));
  document.getElementById("ticketTotal").textContent = formatearPrecio(compra.total);

  document.getElementById("botonSalir").addEventListener("click", () => {
    reiniciarCompra();
    window.location.replace("index.html");
  });
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
