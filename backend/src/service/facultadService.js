const { Facultad } = require('../models');

class FacultadService {

  // 🔹 LISTAR CON PAGINACIÓN
  async listar(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Facultad.findAndCountAll({
      limit,
      offset,
      order: [['nombre', 'ASC']]
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      items: rows
    };
  }

  // 🔹 OBTENER POR ID
  async obtenerPorId(id) {
    const facultad = await Facultad.findByPk(id);

    if (!facultad) {
      throw new Error('Facultad no encontrada');
    }

    return facultad;
  }

  // 🔹 LISTAR TODAS (SIN PAGINACIÓN)
  async listarTodos() {
    return await Facultad.findAll({
      order: [['nombre', 'ASC']]
    });
  }

}

module.exports = new FacultadService();