const authService = require('../service/authService');
const UsuarioDTO = require('../dtos/usuarioDTO');
const jwt = require('jsonwebtoken');

class AuthController {

  async login(req, res) {
    try {
      const { correo, contraseña } = req.body;

      const result = await authService.login(correo, contraseña);

      const userDTO = new UsuarioDTO(result.usuario);

      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_cambiar_en_produccion';
      const token = jwt.sign(
        {
          id: userDTO.id,
          correo: userDTO.correo,
          rol: userDTO.rol,
          idFacultad: userDTO.idFacultad,
          facultad_nombre: userDTO.facultad_nombre,
          facultad: {
            id: userDTO.idFacultad,
            nombre: userDTO.facultad_nombre
          }
        },
        secret,
        { expiresIn: '8h' } // Same duration as previous session
      );

      res.json({
        message: ['Login exitoso'],
        user: userDTO,
        token: token
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
      // JWT is stateless, so logout is handled client-side by removing the token
      res.json({ message: ['Sesión cerrada'] });
    } catch (error) {
      res.status(500).json({ message: ['Error al cerrar sesión'] });
    }
  }

  async me(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: ['No autenticado']
        });
      }

      res.json({
        user: req.user
      });

    } catch (error) {
      res.status(500).json({
        message: ['Error interno']
      });
    }
  }
}

module.exports = new AuthController();