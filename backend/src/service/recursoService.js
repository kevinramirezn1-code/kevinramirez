const { Recurso } = require('../models');

class RecursoService {

  async crear(data) {
    return await Recurso.create(data);
  }

  async listar() {
    return await Recurso.findAll({
      order: [['id', 'ASC']]
    });
  }

  async obtenerPorId(id) {
    const recurso = await Recurso.findByPk(id);
    if (!recurso) throw new Error('Recurso no encontrado');
    return recurso;
  }

  async eliminar(id) {
    const recurso = await this.obtenerPorId(id);
    await recurso.destroy();
    return { message: 'Recurso eliminado' };
  }
}

module.exports = new RecursoService();