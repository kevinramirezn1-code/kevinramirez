const { Sala } = require('../models');

class SalaService {

  async crear(data) {
    return await Sala.create({
      id: data.id,
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      capacidad: Number(data.capacidad),
      estado: data.estado,
      facultad_id: Number(data.facultad_id)
    });
  }

  async listarPorFacultad(facultad_id) {
    return await Sala.findAll({
      where: { facultad_id },
      order: [['id', 'ASC']]
    });
  }

  async obtenerPorId(id) {
    const sala = await Sala.findByPk(id);
    if (!sala) throw new Error('Sala no encontrada');
    return sala;
  }

  async actualizar(id, data) {
    const sala = await this.obtenerPorId(id);

    await sala.update({
      nombre: data.nombre ?? sala.nombre,
      ubicacion: data.ubicacion ?? sala.ubicacion,
      capacidad: data.capacidad ? Number(data.capacidad) : sala.capacidad,
      estado: data.estado ?? sala.estado
      // ❌ facultad NO se toca
    });

    return sala;
  }

  async eliminar(id) {
    const sala = await this.obtenerPorId(id);
    await sala.destroy();
    return { message: 'Sala eliminada' };
  }
}

module.exports = new SalaService();