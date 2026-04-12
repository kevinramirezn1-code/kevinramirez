const { Reserva } = require('../models');

class ReservaService {

  async crear(data) {
    return await Reserva.create(data);
  }

  async listar() {
    return await Reserva.findAll({
      where: { estado: 'ACTIVA' },
      order: [['id', 'ASC']]
    });
  }

  async listarTodas() {
    return await Reserva.findAll({
      order: [['id', 'ASC']]
    });
  }

  async obtenerPorId(id) {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) throw new Error('Reserva no encontrada');
    return reserva;
  }

  async actualizar(id, data) {
    const reserva = await this.obtenerPorId(id);

    if (reserva.estado === 'CANCELADA') {
      throw new Error('No se puede actualizar una reserva cancelada');
    }

    await reserva.update(data);
    return reserva;
  }

  async eliminar(id) {
    const reserva = await this.obtenerPorId(id);

    if (reserva.estado === 'CANCELADA') {
      throw new Error('La reserva ya está cancelada');
    }

    await reserva.update({ estado: 'CANCELADA' });

    return { message: 'Reserva cancelada correctamente' };
  }
}

module.exports = new ReservaService();