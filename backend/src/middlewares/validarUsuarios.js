// Valida los datos de alta de un usuario (API) y los del formulario de login (panel); lo usan usuariosRutas.js y panelRutas.js.
// escribo las variables sin ñ para evitar unos cuantos errores.
const correoMax = 120;
const contraseniaMin = 6;
// bcrypt solo mira los primeros 72 bytes de la contraseña
const contraseniaMax = 72;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizarCorreo(correo) {
  return correo.trim().toLowerCase();
}

function validarUsuario(req, res, next) {
  const { correo, contrasenia } = req.body ?? {};

  if (typeof correo !== "string" || typeof contrasenia !== "string") {
    return res.status(400).json({ error: "El correo y la contraseña son obligatorios." });
  }
  const correoLimpio = normalizarCorreo(correo);
  if (correoLimpio.length > correoMax || !patronCorreo.test(correoLimpio)) {
    return res.status(400).json({ error: "El correo no tiene un formato válido." });
  }
  if (contrasenia.length < contraseniaMin || Buffer.byteLength(contrasenia) > contraseniaMax) {
    return res.status(400).json({ error: `La contraseña debe tener entre ${contraseniaMin} y ${contraseniaMax} caracteres.` });
  }

  req.usuarioNuevo = { correo: correoLimpio, contrasenia };
  next();
}

// el login responde con la página (EJS) y no con JSON, y no revisa el largo de la contraseña, para mas seguridad.
function validarLogin(req, res, next) {
  const { correo, contrasenia } = req.body ?? {};

  if (typeof correo !== "string" || typeof contrasenia !== "string" || !correo.trim() || !contrasenia) {
    return res.status(400).render("login", {
      error: "Ingresa tu correo y tu contraseña.",
      correo: typeof correo === "string" ? correo : "",
    });
  }

  req.credenciales = { correo: normalizarCorreo(correo), contrasenia };
  next();
}

module.exports = { validarUsuario, validarLogin };
