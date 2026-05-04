const authService = require('../service/authService');
const UsuarioDTO = require('../dtos/usuarioDTO');

class AuthController {

  async login(req, res) {
    try {
      const { correo, contraseña } = req.body;

      const result = await authService.login(correo, contraseña);

      const userDTO = new UsuarioDTO(result.usuario);
      req.session.user = userDTO;

      res.json({
        message: ['Login exitoso'],
        user: userDTO
      });

    } catch (error) {
      const message = Array.isArray(error.message)
        ? error.message
        : [error.message || 'Error interno'];

      res.status(error.status || 500).json({ message });
    }
  }

  async register(req, res) {
    try {
      const { correo, contraseña, idFacultad } = req.body;

      const usuario = await authService.register({
        correo,
        contraseña,
        idFacultad
      });

      const userDTO = new UsuarioDTO(usuario);

      res.status(201).json({
        message: ['Usuario registrado'],
        user: userDTO
      });

    } catch (error) {
      const message = Array.isArray(error.message)
        ? error.message
        : [error.message || 'Error interno'];

      res.status(error.status || 500).json({ message });
    }
  }

  async logout(req, res) {
    try {
      req.session.destroy(() => {
        res.json({ message: ['Sesión cerrada'] });
      });
    } catch (error) {
      res.status(500).json({ message: ['Error al cerrar sesión'] });
    }
  }

  async me(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({
          message: ['No autenticado']
        });
      }

      res.json({
        user: req.session.user
      });

    } catch (error) {
      res.status(500).json({
        message: ['Error interno']
      });
    }
  }
}

module.exports = new AuthController();