const formulario = document.getElementById("formUsuario");
const campoCorreo = document.getElementById("correoNuevo");
const campoContrasenia = document.getElementById("contraseniaNueva");
const campoRepetida = document.getElementById("contraseniaRepetida");
const boton = document.getElementById("botonCrearUsuario");
const mensaje = document.getElementById("mensajeUsuario");
const exito = document.getElementById("exitoUsuario");

const exitoGuardado = sessionStorage.getItem("usuarioCreado");
if (exitoGuardado) {
  exito.textContent = `Se creó el administrador ${exitoGuardado}.`;
  exito.hidden = false;
  sessionStorage.removeItem("usuarioCreado");
}

function mostrarError(texto) {
  mensaje.textContent = texto;
  mensaje.hidden = false;
}

function revisarCampos() {
  if (!campoCorreo.value.trim() || !campoCorreo.checkValidity()) return "Ingresá un correo válido.";
  if (campoContrasenia.value.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
  if (campoContrasenia.value !== campoRepetida.value) return "Las contraseñas no coinciden.";
  return null;
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensaje.hidden = true;
  exito.hidden = true;

  const problema = revisarCampos();
  if (problema) return mostrarError(problema);

  boton.disabled = true;
  try {
    const respuesta = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: campoCorreo.value, contrasenia: campoContrasenia.value }),
    });

    if (respuesta.status === 401) {
      window.location.href = "/login";
      return;
    }
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      mostrarError(datos.error ?? "No se pudo crear el administrador.");
      boton.disabled = false;
      return;
    }

    sessionStorage.setItem("usuarioCreado", datos.correo);
    window.location.reload();
  } catch (error) {
    mostrarError("No se pudo conectar con el servidor.");
    boton.disabled = false;
  }
});
