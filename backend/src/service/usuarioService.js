const { Usuario, Facultad } = require('../models');
const UsuarioDTO = require('../dtos/usuarioDTO');

// 🔥 helper para crear errores correctamente
const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = Array.isArray(message) ? message : [message];
  return err;
};

class UsuarioService {

  async crear(data) {

    // 🔥 VALIDACIÓN DTO
    const errores = UsuarioDTO.validarCrear(data);
    if (errores.length > 0) {
      throw createError(400, errores);
    }

    const facultad = await Facultad.findByPk(data.idFacultad);
    if (!facultad) {
      throw createError(400, 'La facultad no existe');
    }

    const existe = await Usuario.findOne({ where: { correo: data.correo } });
    if (existe) {
      throw createError(400, 'El correo ya se encuentra registrado en el sistema y no puede asociarse a otra facultad');
    }

    return await Usuario.create(data);
  }

  async listar(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Usuario.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
      include: [{ model: Facultad, as: 'facultad' }]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: rows
    };
  }

  async obtenerPorId(id) {
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Facultad, as: 'facultad' }]
    });

    if (!usuario) {
      throw createError(404, 'Usuario no encontrado');
    }

    return usuario;
  }

  async actualizar(id, data) {
    const usuario = await this.obtenerPorId(id);

    if (data.contraseña) {
      const errores = UsuarioDTO.validarCrear(data);
      if (errores.length > 0) {
        throw createError(400, errores);
      }
    }

    if (data.correo && data.correo !== usuario.correo) {
      const existe = await Usuario.findOne({ where: { correo: data.correo } });
      if (existe) {
        throw createError(400, 'El correo ya está en uso');
      }
    }

    if (data.idFacultad) {
      const facultad = await Facultad.findByPk(data.idFacultad);
      if (!facultad) {
        throw createError(400, 'La facultad no existe');
      }
    }

    await usuario.update(data);
    return usuario;
  }

  async eliminar(id) {
    const usuario = await this.obtenerPorId(id);
    await usuario.destroy();
    return { message: 'Usuario eliminado' };
  }

  async obtenerDocentesPorFacultad(idFacultad) {
    return await Usuario.findAll({
      where: {
        rol: "DOCENTE",
        idFacultad: idFacultad
      },
      attributes: ["id", "correo", "idFacultad"]
    });
  }
}

module.exports = new UsuarioService();