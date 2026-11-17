// Muestra los datos del tipo de producto elegido y manda el formulario de alta a la API; lo carga formularioProducto.ejs.
const formulario = document.getElementById("formProducto");
const selectorTipo = document.getElementById("tipo");
const botonGuardar = document.getElementById("botonGuardar");
const mensaje = document.getElementById("mensajeFormulario");
const grupos = formulario.querySelectorAll("[data-tipo]");

function mostrarGrupoDelTipo() {
  for (const grupo of grupos) {
    const elegido = grupo.dataset.tipo === selectorTipo.value;
    grupo.hidden = !elegido;
    grupo.disabled = !elegido;
  }
}

function mostrarError(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = false;
  mensaje.scrollIntoView({ behavior: "smooth", block: "center" });
}

selectorTipo.addEventListener("change", mostrarGrupoDelTipo);
mostrarGrupoDelTipo();

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensaje.hidden = true;
  botonGuardar.disabled = true;

  try {
    const respuesta = await fetch(formulario.dataset.api, { method: "POST", body: new FormData(formulario) });

    if (respuesta.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (!respuesta.ok) {
      const datos = await respuesta.json().catch(() => ({}));
      mostrarError(datos.error ?? "No se pudo guardar el producto.");
      botonGuardar.disabled = false;
      return;
    }

    window.location.href = "/admin/dashboard";
  } catch (error) {
    mostrarError("No se pudo conectar con el servidor.");
    botonGuardar.disabled = false;
  }
});
