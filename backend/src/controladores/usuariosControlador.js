// Logica de alta de administradores
const bcrypt = require("bcrypt");
const { Usuario } = require("../modelos/usuario");

const rondasBcrypt = 10;

async function crearUsuario(req, res, next) {
  try {
    const { correo, contrasenia } = req.usuarioNuevo;

    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ error: "Ya existe un usuario con ese correo." });
    }

    const contraseniaHash = await bcrypt.hash(contrasenia, rondasBcrypt);
    const usuario = await Usuario.create({ correo, contraseniaHash });

    // La respuesta no incluye contraseñas u hash para evitar vulnerabilidades
    res.status(201).json({ id: usuario.id, correo: usuario.correo });
  } catch (error) {
    next(error);
  }
}

module.exports = { crearUsuario, rondasBcrypt };
