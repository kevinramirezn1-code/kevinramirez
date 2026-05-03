const { Usuario, Facultad } = require('../models');

class UsuarioService {

  async crear(data) {
    const facultad = await Facultad.findByPk(data.idFacultad);
    if (!facultad) throw new Error('Facultad no existe');

    const existe = await Usuario.findOne({ where: { correo: data.correo } });
    if (existe) throw new Error('Correo ya registrado');

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

    if (!usuario) throw new Error('Usuario no encontrado');
    return usuario;
  }

  async actualizar(id, data) {
    const usuario = await this.obtenerPorId(id);

    if (data.correo && data.correo !== usuario.correo) {
      const existe = await Usuario.findOne({ where: { correo: data.correo } });
      if (existe) throw new Error('Correo ya usado');
    }

    if (data.idFacultad) {
      const facultad = await Facultad.findByPk(data.idFacultad);
      if (!facultad) throw new Error('Facultad no existe');
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