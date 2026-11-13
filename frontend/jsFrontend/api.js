// Trae los productos paginados (por ahora desde data/productos.json); lo usa productos.js.
const urlProductos = "data/productos.json";

export async function obtenerProductos({ tipo, pagina = 1, limite = 6 }) {
  const respuesta = await fetch(urlProductos);
  if (!respuesta.ok) {
    throw new Error(`No se pudieron cargar los productos (error ${respuesta.status}).`);
  }
  const todos = await respuesta.json();

  const filtrados = todos
    .filter((producto) => producto.activo === true && producto.tipo === tipo)
    .sort((a, b) => a.id - b.id);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / limite));
  const paginaValida = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaValida - 1) * limite;

  return {
    productos: filtrados.slice(inicio, inicio + limite),
    pagina: paginaValida,
    totalPaginas,
    total: filtrados.length,
  };
}