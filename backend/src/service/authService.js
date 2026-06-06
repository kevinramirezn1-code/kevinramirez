const { Usuario, Facultad, ListaBlanca } = require('../models');
const UsuarioDTO = require('../dtos/usuarioDTO'); // 🔥 IMPORTANTE

class AuthService {

  async register({ correo, contraseña, idFacultad }) {

    // 🔥 VALIDACIÓN CENTRALIZADA EN DTO
    const errores = UsuarioDTO.validarCrear({ correo, contraseña, idFacultad });
    if (errores.length > 0) {
      throw { status: 400, message: errores };
    }

    const facultad = await Facultad.findByPk(idFacultad);
    if (!facultad) {
      throw { status: 400, message: 'La facultad especificada no existe' };
    }

    const existe = await Usuario.findOne({ where: { correo } });
    if (existe) {
      throw { status: 400, message: 'El correo ya está registrado' };
    }

    const enListaBlanca = await ListaBlanca.findOne({ where: { correo } });
    const rol = enListaBlanca ? 'secretaria' : 'docente';

    const nuevoUsuario = await Usuario.create({
      correo,
      contraseña,
      rol,
      idFacultad
    });

    const usuarioConFacultad = await Usuario.findByPk(nuevoUsuario.id, {
      include: {
        model: Facultad,
        attributes: ['id', 'nombre']
      }
    });

    const usuarioResponse = usuarioConFacultad.toJSON();
    delete usuarioResponse.contraseña;

    return usuarioResponse;
  }

  async login(correo, contraseña) {

    const errores = UsuarioDTO.validarLogin({ correo, contraseña });
    if (errores.length > 0) {
      throw { status: 400, message: errores };
    }

    const usuario = await Usuario.findOne({
      where: { correo },
      include: {
        model: Facultad,
        attributes: ['id', 'nombre']
      }
    });

    if (!usuario) {
      throw { status: 400, message: 'Credenciales inválidas' };
    }

    if (usuario.contraseña !== contraseña) {
      throw { status: 400, message: 'Credenciales inválidas' };
    }

    const usuarioResponse = usuario.toJSON();
    delete usuarioResponse.contraseña;

    return { usuario: usuarioResponse };
  }
}

module.exports = new AuthService();