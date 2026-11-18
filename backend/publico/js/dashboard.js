// Pide confirmación en un modal y ejecuta desactivar, reactivar o eliminar un producto contra la API; lo carga dashboard.ejs.
const dialogo = document.getElementById("dialogoConfirmar");
const titulo = document.getElementById("dialogoTitulo");
const texto = document.getElementById("dialogoTexto");
const error = document.getElementById("dialogoError");
const botonCancelar = document.getElementById("dialogoCancelar");
const botonConfirmar = document.getElementById("dialogoConfirmarBoton");

const jsonHeaders = { "Content-Type": "application/json" };

const acciones = {
  desactivar: {
    titulo: "Desactivar producto",
    texto: (nombre) => `¿Seguro que querés desactivar "${nombre}"? Dejará de verse en la tienda, pero podés reactivarlo cuando quieras.`,
    boton: "Desactivar",
    peticion: (id) => [`/api/productos/${id}/estado`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ activo: false }) }],
  },
  reactivar: {
    titulo: "Reactivar producto",
    texto: (nombre) => `¿Seguro que querés reactivar "${nombre}"? Volverá a verse en la tienda.`,
    boton: "Reactivar",
    peticion: (id) => [`/api/productos/${id}/estado`, { method: "PATCH", headers: jsonHeaders, body: JSON.stringify({ activo: true }) }],
  },
  eliminar: {
    titulo: "Eliminar producto",
    texto: (nombre) => `¿Seguro que querés eliminar "${nombre}" definitivamente? Esta acción no se puede deshacer. Si ya se vendió, no se va a poder eliminar y conviene desactivarlo.`,
    boton: "Eliminar",
    peticion: (id) => [`/api/productos/${id}`, { method: "DELETE" }],
  },
};

let pendiente = null;

document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;

  const accion = acciones[boton.dataset.accion];
  pendiente = { accion, id: boton.dataset.id };

  titulo.textContent = accion.titulo;

  texto.textContent = accion.texto(boton.dataset.nombre);
  botonConfirmar.textContent = accion.boton;
  botonConfirmar.disabled = false;
  error.hidden = true;
  dialogo.showModal();
});

botonCancelar.addEventListener("click", () => dialogo.close());

botonConfirmar.addEventListener("click", async () => {
  if (!pendiente) return;
  botonConfirmar.disabled = true;
  error.hidden = true;

  try {

    const [url, opciones] = pendiente.accion.peticion(pendiente.id);
    const respuesta = await fetch(url, opciones);

    if (respuesta.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (!respuesta.ok) {
      const datos = await respuesta.json().catch(() => ({}));
      error.textContent = datos.error ?? "No se pudo completar la acción.";
      error.hidden = false;
      botonConfirmar.disabled = false;
      return;
    }

    window.location.reload();
  } catch (fallo) {
    error.textContent = "No se pudo conectar con el servidor.";
    error.hidden = false;
    botonConfirmar.disabled = false;
  }
});
