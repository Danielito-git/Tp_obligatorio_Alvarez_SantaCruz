// Guarda el nombre y el carrito de la compra actual; lo usan bienvenida.js, productos.js y layout.js.
const claveNombre = "autoservicioNombre";
const claveCarrito = "autoservicioCarrito";

export const eventoCarrito = "carritoActualizado";

export function guardarNombre(nombre) {
  sessionStorage.setItem(claveNombre, nombre);
}

export function obtenerNombre() {
  return sessionStorage.getItem(claveNombre);
}

export function obtenerCarrito() {
  try {
    const datos = JSON.parse(sessionStorage.getItem(claveCarrito));
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
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

export function reiniciarCompra() {
  sessionStorage.removeItem(claveNombre);
  sessionStorage.removeItem(claveCarrito);
}
