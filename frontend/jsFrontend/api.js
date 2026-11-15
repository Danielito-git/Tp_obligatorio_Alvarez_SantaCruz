// Se comunica con la API del backend: productos paginados (productos.js), ventas (carrito.js) y ticket en PDF (ticket.js).
import { config } from "./config.js";

export async function obtenerProductos({ tipo, pagina = 1, limite = 6 }) {
  const parametros = new URLSearchParams({ tipo, pagina, limite });
  const respuesta = await fetch(`${config.urlApi}/productos?${parametros}`);
  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los productos (error ${respuesta.status}).`);
  }
  return respuesta.json();
}

export async function crearVenta({ nombre, productos }) {
  let respuesta;
  try {
    respuesta = await fetch(`${config.urlApi}/ventas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        productos: productos.map(({ id, cantidad }) => ({ id, cantidad })),
      }),
    });
  } catch (error) {
    throw new Error("No pudimos conectarnos con el servidor. Revisá la conexión e intentá de nuevo.");
  }

  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error ?? `No se pudo guardar la compra (error ${respuesta.status}).`);
    error.productosNoDisponibles = datos.productosNoDisponibles ?? [];
    throw error;
  }
  return datos;
}

export async function descargarTicket(idVenta) {
  let respuesta;
  try {
    respuesta = await fetch(`${config.urlApi}/ventas/${idVenta}/ticket`);
  } catch (error) {
    throw new Error("No pudimos conectarnos con el servidor. Revisá la conexión e intentá de nuevo.");
  }

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error ?? `No se pudo generar el PDF (error ${respuesta.status}).`);
  }
  return respuesta.blob();
}
