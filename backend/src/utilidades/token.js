// Crea y lee el token JWT de la sesion del administrador, y define como se guarda en la cookie. lo usan panelControlador.js y sesion.js.
const jwt = require("jsonwebtoken");

const nombreCookie = "tokenAdmin";
const duracionSegundos = 2 * 60 * 60;

// httpOnly: el JavaScript del navegador no puede leer la cookie. 
// sameSite lax: no viaja en peticiones que vienen de otros sitios.
const opcionesBase = { httpOnly: true, sameSite: "lax" };
const opcionesCookie = { ...opcionesBase, maxAge: duracionSegundos * 1000 };

function crearToken(usuario) {
  return jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.claveJwt, {
    algorithm: "HS256",
    expiresIn: duracionSegundos,
  });
}

// Devuelve los datos del token, o null si falta, fue modificado o ya se vencio.
function leerToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.claveJwt, { algorithms: ["HS256"] });
  } catch (error) {
    return null;
  }
}

module.exports = { nombreCookie, opcionesBase, opcionesCookie, crearToken, leerToken };
