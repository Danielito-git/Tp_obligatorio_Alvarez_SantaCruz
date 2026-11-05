// Lógica de la pantalla de productos (productos.html).
import { config } from "./config.js";
import { obtenerProductos } from "./api.js";
import { formatearAtributo, formatearPrecio } from "./formato.js";
import { crearIcono, montarLayout } from "./layout.js";
import {
  obtenerNombre,
  cantidadEnCarrito,
  agregarAlCarrito,
  restarDelCarrito,
  quitarDelCarrito,
} from "./sesion.js";

const nombre = obtenerNombre();

const estado = { categoria: config.categorias[0].id, pagina: 1 };
let numeroDeConsulta = 0;

const elementos = {
  categorias: document.getElementById("categorias"),
  titulo: document.getElementById("tituloCategoria"),
  estado: document.getElementById("estado"),
  grilla: document.getElementById("grilla"),
  paginacion: document.getElementById("paginacion"),
};

function iniciar() {
  montarLayout({ titulo: "Productos", pantalla: "productos" });
  document.getElementById("saludo").textContent = `Hola, ${nombre}. Elegí tus productos.`;

  leerEstadoDeUrl();
  pintarCategorias();
  cargarProductos();
}

function leerEstadoDeUrl() {
  const parametros = new URLSearchParams(window.location.search);
  const categoria = parametros.get("categoria");
  const pagina = Number.parseInt(parametros.get("pagina"), 10);

  if (config.categorias.some((c) => c.id === categoria)) estado.categoria = categoria;
  if (Number.isInteger(pagina) && pagina > 0) estado.pagina = pagina;
}

function escribirEstadoEnUrl() {
  const parametros = new URLSearchParams({ categoria: estado.categoria, pagina: estado.pagina });
  window.history.replaceState(null, "", `?${parametros}`);
}

function pintarCategorias() {
  elementos.categorias.replaceChildren(
    ...config.categorias.map((categoria) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "categoria";
      boton.setAttribute("aria-pressed", String(categoria.id === estado.categoria));

      const texto = document.createElement("span");
      texto.textContent = categoria.nombre;
      boton.append(crearIcono(categoria.icono), texto);

      boton.addEventListener("click", () => {
        if (categoria.id === estado.categoria) return;
        estado.categoria = categoria.id;
        estado.pagina = 1;
        pintarCategorias();
        cargarProductos();
      });
      return boton;
    })
  );

  const actual = config.categorias.find((c) => c.id === estado.categoria);
  elementos.titulo.textContent = actual.nombre;
}

async function cargarProductos() {
  const consulta = ++numeroDeConsulta;
  mostrarEstado("Cargando productos…");
  elementos.grilla.setAttribute("aria-busy", "true");

  try {
    const resultado = await obtenerProductos({
      tipo: estado.categoria,
      pagina: estado.pagina,
      limite: config.productosPorPagina,
    });
    if (consulta !== numeroDeConsulta) return;

    estado.pagina = resultado.pagina;
    escribirEstadoEnUrl();

    if (resultado.total === 0) {
      elementos.grilla.replaceChildren();
      elementos.paginacion.replaceChildren();
      mostrarEstado("No hay productos disponibles en esta categoría por ahora.");
      return;
    }

    ocultarEstado();
    elementos.grilla.replaceChildren(...resultado.productos.map(crearTarjeta));
    pintarPaginacion(resultado);
  } catch (error) {
    if (consulta !== numeroDeConsulta) return;
    console.error(error);
    elementos.grilla.replaceChildren();
    elementos.paginacion.replaceChildren();
    mostrarEstado("No pudimos cargar los productos. Revisá la conexión e intentá de nuevo.", true);
  } finally {
    if (consulta === numeroDeConsulta) elementos.grilla.removeAttribute("aria-busy");
  }
}

function mostrarEstado(mensaje, conReintento = false) {
  elementos.estado.replaceChildren(document.createTextNode(mensaje));
  elementos.estado.classList.toggle("estadoError", conReintento);
  elementos.estado.hidden = false;

  if (conReintento) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "boton botonPrimario";
    boton.textContent = "Reintentar";
    boton.addEventListener("click", cargarProductos);
    elementos.estado.append(boton);
  }
}

function ocultarEstado() {
  elementos.estado.hidden = true;
  elementos.estado.replaceChildren();
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "producto";

  const imagen = document.createElement("img");
  imagen.className = "productoImagen";
  imagen.src = producto.imagen;
  imagen.alt = producto.nombre;
  imagen.loading = "lazy";
  imagen.width = 200;
  imagen.height = 200;

  const cuerpo = document.createElement("div");
  cuerpo.className = "productoCuerpo";

  const datos = document.createElement("p");
  datos.className = "productoDatos";
  const categoria = config.categorias.find((c) => c.id === producto.tipo);
  datos.textContent = `${categoria ? categoria.nombre : producto.tipo} · Cód. ${producto.id}`;

  const titulo = document.createElement("h2");
  titulo.className = "productoNombre";
  titulo.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "productoPrecio";
  precio.textContent = formatearPrecio(producto.precio);

  const controles = document.createElement("div");
  controles.className = "productoControles";

  cuerpo.append(datos, titulo, precio, crearAtributos(producto, categoria), controles);
  tarjeta.append(imagen, cuerpo);

  pintarControles(tarjeta, controles, producto);

  controles.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const accion = boton.dataset.accion;
    if (accion === "agregar" || accion === "sumar") agregarAlCarrito(producto);
    else if (accion === "restar") restarDelCarrito(producto.id);
    else if (accion === "quitar") quitarDelCarrito(producto.id);

    pintarControles(tarjeta, controles, producto);
    devolverFoco(controles, accion);
  });

  return tarjeta;
}

function crearAtributos(producto, categoria) {
  const lista = document.createElement("dl");
  lista.className = "productoAtributos";
  const atributos = producto.atributos ?? {};

  for (const atributo of categoria?.atributos ?? []) {
    if (atributos[atributo.clave] === undefined) continue;
    const nombre = document.createElement("dt");
    nombre.textContent = atributo.nombre;
    const valor = document.createElement("dd");
    valor.textContent = formatearAtributo(atributos[atributo.clave], atributo.unidad);
    lista.append(nombre, valor);
  }
  return lista;
}

function pintarControles(tarjeta, controles, producto) {
  const cantidad = cantidadEnCarrito(producto.id);
  tarjeta.classList.toggle("productoEnCarrito", cantidad > 0);

  if (cantidad === 0) {
    const agregar = crearBotonAccion("agregar", "Agregar", "boton botonPrimario botonAncho");
    agregar.setAttribute("aria-label", `Agregar ${producto.nombre} al carrito`);
    agregar.prepend(crearIcono("iconoCarrito"));
    controles.replaceChildren(agregar);
    return;
  }

  const contador = document.createElement("div");
  contador.className = "contador";

  const restar = crearBotonAccion("restar", "", "contadorBoton");
  restar.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);
  restar.append(crearIcono("iconoMenos"));

  const valor = document.createElement("output");
  valor.className = "contadorValor";
  valor.setAttribute("aria-live", "polite");
  const textoOculto = document.createElement("span");
  textoOculto.className = "soloLectores";
  textoOculto.textContent = " en carrito";
  valor.append(String(cantidad), textoOculto);

  const sumar = crearBotonAccion("sumar", "", "contadorBoton");
  sumar.setAttribute("aria-label", `Agregar una unidad de ${producto.nombre}`);
  sumar.append(crearIcono("iconoMas"));

  contador.append(restar, valor, sumar);

  const quitar = crearBotonAccion("quitar", "Quitar del carrito", "botonPlano");
  quitar.prepend(crearIcono("iconoQuitar"));

  controles.replaceChildren(contador, quitar);
}

function crearBotonAccion(accion, texto, clase) {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = clase;
  boton.dataset.accion = accion;
  if (texto) boton.textContent = texto;
  return boton;
}

function devolverFoco(controles, accion) {
  const destino = { agregar: "sumar", sumar: "sumar", restar: "restar", quitar: "agregar" }[accion];
  const boton =
    controles.querySelector(`[data-accion="${destino}"]`) ||
    controles.querySelector("[data-accion]");
  if (boton) boton.focus();
}

function pintarPaginacion({ pagina, totalPaginas }) {
  const botones = [];

  const anterior = crearBotonPagina(pagina - 1, "Anterior", pagina === 1);
  anterior.prepend(crearIcono("iconoAnterior"));
  botones.push(anterior);

  for (let numero = 1; numero <= totalPaginas; numero++) {
    const boton = crearBotonPagina(numero, String(numero), false);
    boton.classList.add("paginacionNumero");
    boton.setAttribute("aria-label", `Página ${numero}`);
    if (numero === pagina) boton.setAttribute("aria-current", "page");
    botones.push(boton);
  }

  const siguiente = crearBotonPagina(pagina + 1, "Siguiente", pagina === totalPaginas);
  siguiente.append(crearIcono("iconoSiguiente"));
  botones.push(siguiente);

  const resumen = document.createElement("p");
  resumen.className = "paginacionResumen";
  resumen.textContent = `Página ${pagina} de ${totalPaginas}`;

  elementos.paginacion.replaceChildren(...botones, resumen);
}

function crearBotonPagina(destino, texto, deshabilitado) {
  const boton = document.createElement("button");
  
  boton.type = "button";
  boton.className = "boton";
  boton.disabled = deshabilitado;
  boton.textContent = texto;
  boton.addEventListener("click", () => {
    if (destino === estado.pagina) return;
    estado.pagina = destino;
    cargarProductos();
    elementos.titulo.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  return boton;
}

if (!nombre) {
  window.location.replace("index.html");
} else {
  iniciar();
}