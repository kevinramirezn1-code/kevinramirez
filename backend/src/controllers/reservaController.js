const reservaService = require('../service/reservaService');
const ReservaDTO = require('../dtos/reservaDTO');
const { Reserva, Sala, Usuario } = require('../models');
const { Op } = require('sequelize');

// 🔹 CREAR
exports.crear = async (req, res, next) => {
  try {
    const errors = ReservaDTO.validarCrear(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const { fechaInicio, fechaFin, idUsuario, idSala } = req.body;

    const sala = await Sala.findByPk(idSala);
    if (!sala) {
      return res.status(400).json({ error: 'La sala no existe' });
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      return res.status(400).json({ error: 'El usuario no existe' });
    }

    // SOLO reservas ACTIVAS
    const reservas = await Reserva.findAll({
      where: {
        idSala,
        estado: 'ACTIVA'
      }
    });

    const existeCruce = reservas.some(r =>
      new Date(fechaInicio) < new Date(r.fechaFin) &&
      new Date(fechaFin) > new Date(r.fechaInicio)
    );

    if (existeCruce) {
      return res.status(400).json({
        error: 'La sala ya está reservada en ese horario'
      });
    }

    const reserva = await reservaService.crear(req.body);
    res.status(201).json(new ReservaDTO(reserva));

  } catch (error) {
    next(error);
  }
};

// 🔹 LISTAR
exports.listar = async (req, res, next) => {
  try {
    const { fecha } = req.query;

    if (fecha) {
      const inicioDia = new Date(fecha + "T00:00:00");
      const finDia = new Date(fecha + "T23:59:59");

      const reservas = await Reserva.findAll({
        where: {
          estado: 'ACTIVA',
          fechaInicio: { [Op.lte]: finDia },
          fechaFin: { [Op.gte]: inicioDia }
        },
        order: [['fechaInicio', 'ASC']]
      });

      return res.json(reservas.map(r => new ReservaDTO(r)));
    }

    const reservas = await reservaService.listar();
    res.json(reservas.map(r => new ReservaDTO(r)));

  } catch (error) {
    next(error);
  }
};

// 🔹 OBTENER POR ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const reserva = await reservaService.obtenerPorId(req.params.id);
    res.json(new ReservaDTO(reserva));
  } catch (error) {
    next(error);
  }
};

// 🔹 ACTUALIZAR 
exports.actualizar = async (req, res, next) => {
  try {
    const errors = ReservaDTO.validarActualizar(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const reservaActual = await reservaService.obtenerPorId(req.params.id);

    if (reservaActual.estado === 'CANCELADA') {
      return res.status(400).json({ error: 'No se puede modificar una reserva cancelada' });
    }

    // 🔥 validar cruce si vienen fechas o sala
    const fechaInicio = req.body.fechaInicio || reservaActual.fechaInicio;
    const fechaFin = req.body.fechaFin || reservaActual.fechaFin;
    const idSala = req.body.idSala || reservaActual.idSala;

    const reservas = await Reserva.findAll({
      where: {
        idSala,
        estado: 'ACTIVA',
        id: { [Op.ne]: reservaActual.id } // excluir la misma
      }
    });

    const existeCruce = reservas.some(r =>
      new Date(fechaInicio) < new Date(r.fechaFin) &&
      new Date(fechaFin) > new Date(r.fechaInicio)
    );

    if (existeCruce) {
      return res.status(400).json({
        error: 'Conflicto de horario con otra reserva'
      });
    }

    const reserva = await reservaService.actualizar(req.params.id, req.body);
    res.json(new ReservaDTO(reserva));

  } catch (error) {
    next(error);
  }
};

// 🔹 CANCELAR 
exports.cancelar = async (req, res, next) => {
  try {
    const resultado = await reservaService.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};