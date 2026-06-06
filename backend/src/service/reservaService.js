const { Reserva, Usuario, Sala } = require('../models');
const { Op } = require('sequelize');

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

  async historialFacultad({ idSala, estado, fechaInicio, fechaFin } = {}) {

    const where = {};

    if (idSala) {
      where.idSala = idSala;
    }

    if (estado) {
      where.estado = estado;
    }

    if (fechaInicio || fechaFin) {

      where.fechaInicio = {};

      if (fechaInicio) {
        where.fechaInicio[Op.gte] =
          new Date(`${fechaInicio}T00:00:00`);
      }

      if (fechaFin) {
        where.fechaInicio[Op.lte] =
          new Date(`${fechaFin}T23:59:59`);
      }
    }

    return await Reserva.findAll({
      where,
      order: [['fechaInicio', 'DESC']]
    });
  }

  async reporteUsoDocentes({ fechaInicio, fechaFin }) {

    const where = {
      estado: 'ACTIVA'
    };

    if (fechaInicio || fechaFin) {

      where.fechaInicio = {};

      if (fechaInicio) {
        where.fechaInicio[Op.gte] =
          new Date(`${fechaInicio}T00:00:00`);
      }

      if (fechaFin) {
        where.fechaInicio[Op.lte] =
          new Date(`${fechaFin}T23:59:59`);
      }
    }

    const reservas = await Reserva.findAll({
      where,
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'correo']
        }
      ]
    });

    const reporte = {};

    reservas.forEach(r => {

      const horas =
        (new Date(r.fechaFin) - new Date(r.fechaInicio))
        / (1000 * 60 * 60);

      const id = r.idUsuario;

      if (!reporte[id]) {
        reporte[id] = {
          docente: r.usuario?.correo || id,
          horas: 0,
          reservas: 0
        };
      }

      reporte[id].horas += horas;
      reporte[id].reservas += 1;
    });

    return Object.values(reporte);
  }

  async reporteUsoSalas({ fechaInicio, fechaFin }) {

    const where = {
      estado: 'ACTIVA'
    };

    if (fechaInicio || fechaFin) {

      where.fechaInicio = {};

      if (fechaInicio) {
        where.fechaInicio[Op.gte] =
          new Date(`${fechaInicio}T00:00:00`);
      }

      if (fechaFin) {
        where.fechaInicio[Op.lte] =
          new Date(`${fechaFin}T23:59:59`);
      }
    }

    const reservas = await Reserva.findAll({
      where,
      include: [
        {
          model: Sala,
          as: 'sala'
        }
      ]
    });

    const reporte = {};

    reservas.forEach(r => {

      const horas =
        (new Date(r.fechaFin) - new Date(r.fechaInicio))
        / (1000 * 60 * 60);

      const id = r.idSala;

      if (!reporte[id]) {
        reporte[id] = {
          sala: r.sala?.nombre || id,
          horas: 0,
          reservas: 0
        };
      }

      reporte[id].horas += horas;
      reporte[id].reservas += 1;
    });

    return Object.values(reporte);
  }

  async reporteOcupacionSalas({ fechaInicio, fechaFin }) {

    const where = {
      estado: 'ACTIVA'
    };

    if (fechaInicio || fechaFin) {

      where.fechaInicio = {};

      if (fechaInicio) {
        where.fechaInicio[Op.gte] =
          new Date(`${fechaInicio}T00:00:00`);
      }

      if (fechaFin) {
        where.fechaInicio[Op.lte] =
          new Date(`${fechaFin}T23:59:59`);
      }
    }

    const reservas = await Reserva.findAll({
      where,
      include: [
        {
          model: Sala,
          as: 'sala'
        }
      ]
    });

    const reporte = {};

    reservas.forEach(r => {

      const horas =
        (new Date(r.fechaFin) - new Date(r.fechaInicio))
        / (1000 * 60 * 60);

      const id = r.idSala;

      if (!reporte[id]) {
        reporte[id] = {
          sala: r.sala?.nombre || id,
          horasOcupadas: 0
        };
      }

      reporte[id].horasOcupadas += horas;
    });

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const dias =
      Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24)) + 1;

    const horasDisponibles = dias * 14.5;

    Object.values(reporte).forEach(r => {

      r.horasDisponibles = horasDisponibles;

      r.porcentaje =
        ((r.horasOcupadas / horasDisponibles) * 100)
        .toFixed(2);
    });

    return Object.values(reporte);
  }

  async reporteReservas({
    numeroReservas
  } = {}) {

    const reservas =
      await Reserva.findAll({
        where: {
          estado: 'ACTIVA'
        }
      });

    const resultado = {};

    reservas.forEach(r => {

      if (
        !resultado[
          r.idSala
        ]
      ) {

        resultado[
          r.idSala
        ] = 0;

      }

      resultado[
        r.idSala
      ] += 1;

    });

    return Object
    .entries(resultado)
    .filter(([sala,total]) =>

      total >= numeroReservas

    )
    .map(([sala,total]) => ({

      sala,

      numeroReservas:
        total

    }));

  }

  async historialDocente({
    idUsuario,
    fechaInicio,
    fechaFin,
    estado
  } = {}) {

    const where = {};

    // obligatorio
    if (idUsuario) {
      where.idUsuario = idUsuario;
    }

    // opcional
    if (estado) {
      where.estado = estado;
    }

    // rango fechas
    if (fechaInicio || fechaFin) {

      where.fechaInicio = {};

      if (fechaInicio) {
        where.fechaInicio[Op.gte] =
          new Date(`${fechaInicio}T00:00:00`);
      }

      if (fechaFin) {
        where.fechaInicio[Op.lte] =
          new Date(`${fechaFin}T23:59:59`);
      }
    }

    return await Reserva.findAll({
      where,

      include: [
        {
          model: Sala,
          as: 'sala',
          attributes: ['id', 'nombre']
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'correo']
        }
      ],

      order: [['fechaInicio', 'DESC']]
    });
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