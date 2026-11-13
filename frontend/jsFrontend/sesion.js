// Guarda el nombre, el carrito y la compra confirmada; lo usan todas las pantallas a través de sus scripts.
const claveNombre = "technologiaNombre";
const claveCarrito = "technologiaCarrito";
const claveCompra = "technologiaCompra";

export const eventoCarrito = "carritoActualizado";

export function guardarNombre(nombre) {
  sessionStorage.setItem(claveNombre, nombre);
}

export function obtenerNombre() {
  return sessionStorage.getItem(claveNombre);
}

function leerJson(clave, valorPorDefecto) {
  try {
    return JSON.parse(sessionStorage.getItem(clave)) ?? valorPorDefecto;
  } catch (error) {
    return valorPorDefecto;
  }
}

export function obtenerCarrito() {
  const datos = leerJson(claveCarrito, []);
  return Array.isArray(datos) ? datos : [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem(claveCarrito, JSON.stringify(carrito));
  window.dispatchEvent(new CustomEvent(eventoCarrito));
}

export function cantidadEnCarrito(idProducto) {
  const linea = obtenerCarrito().find((item) => item.id === idProducto);
  return linea ? linea.cantidad : 0;
}

export function totalUnidades() {
  return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

export function totalCarrito() {
  return obtenerCarrito().reduce((total, item) => total + item.precio * item.cantidad, 0);
}

export function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const linea = carrito.find((item) => item.id === producto.id);
  if (linea) {
    linea.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      tipo: producto.tipo,
      cantidad: 1,
    });
  }
  guardarCarrito(carrito);
}

export function restarDelCarrito(idProducto) {
  const carrito = obtenerCarrito();
  const linea = carrito.find((item) => item.id === idProducto);
  if (!linea) return;
  linea.cantidad -= 1;
  guardarCarrito(carrito.filter((item) => item.cantidad > 0));
}

export function quitarDelCarrito(idProducto) {
  guardarCarrito(obtenerCarrito().filter((item) => item.id !== idProducto));
}

export function confirmarCompra() {
  const carrito = obtenerCarrito();
  const compra = {
    nombre: obtenerNombre(),
    fecha: new Date().toISOString(),
    productos: carrito,
    total: totalCarrito(),
  };
  sessionStorage.setItem(claveCompra, JSON.stringify(compra));
  guardarCarrito([]);
  return compra;
}

export function obtenerCompra() {
  return leerJson(claveCompra, null);
}

export function reiniciarCompra() {
  sessionStorage.removeItem(claveNombre);
  sessionStorage.removeItem(claveCarrito);
  sessionStorage.removeItem(claveCompra);
}
