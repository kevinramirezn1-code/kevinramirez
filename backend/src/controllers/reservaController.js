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

    // 🔥 FACULTAD DEL USUARIO LOGEADO
    const idFacultad =
      req.user.idFacultad;

    const whereReserva = {
      estado: 'ACTIVA'
    };

    // 🔥 FILTRO POR FECHA
    if (fecha) {

      const inicioDia =
        new Date(fecha + "T00:00:00");

      const finDia =
        new Date(fecha + "T23:59:59");

      whereReserva.fechaInicio = {
        [Op.lte]: finDia
      };

      whereReserva.fechaFin = {
        [Op.gte]: inicioDia
      };
    }

    const reservas =
      await Reserva.findAll({

        where: whereReserva,

        include: [
          {
            model: Usuario,
            as: 'usuario',

            where: {
              idFacultad
            },

            attributes: [
              'id',
              'correo',
              'idFacultad'
            ]
          },

          {
            model: Sala,
            as: 'sala',
            attributes: [
              'id',
              'nombre'
            ]
          }
        ],

        order: [['fechaInicio', 'ASC']]
      });

    res.json(
      reservas.map(r =>
        new ReservaDTO(r)
      )
    );

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

// 🔹 HISTORIAL FACULTAD (HU-13)
exports.historialFacultad = async (req, res, next) => {
  try {
    const { idSala, estado, fechaInicio, fechaFin } = req.query;

    const estadosValidos = ['ACTIVA', 'CANCELADA', 'FINALIZADA'];

    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido. Use ACTIVA, CANCELADA o FINALIZADA'
      });
    }

    const reservas = await reservaService.historialFacultad({
      idSala,
      estado,
      fechaInicio,
      fechaFin
    });

    res.json(reservas.map(r => new ReservaDTO(r)));

  } catch (error) {
    next(error);
  }
};

// 🔹 REPORTE POR NÚMERO DE RESERVAS
exports.reporteReservas =
async (req,res,next) => {

  try {

    const {
      numeroReservas
    } = req.query;

    if (
      !numeroReservas
    ) {

      return res.status(400)
      .json({

        error:
        'Debe ingresar un número de reservas'

      });

    }

    if (
      Number(numeroReservas) < 1
    ) {

      return res.status(400)
      .json({

        error:
        'El número debe ser mayor a cero'

      });

    }

    const reporte =
      await reservaService
      .reporteReservas({

        numeroReservas:
        Number(numeroReservas)

      });

    if (
      reporte.length === 0
    ) {

      return res.status(404)
      .json({

        error:
        'No hay reservas con ese número ingresado'

      });

    }

    res.json(reporte);

  } catch(error) {

    next(error);

  }

};

// 🔹 REPORTE USO DOCENTES
exports.reporteUsoDocentes = async (req, res, next) => {
  try {

    const reporte =
      await reservaService.reporteUsoDocentes(req.query);

    res.json(reporte);

  } catch (error) {
    next(error);
  }
};

// 🔹 REPORTE USO SALAS
exports.reporteUsoSalas = async (req, res, next) => {
  try {

    const reporte =
      await reservaService.reporteUsoSalas(req.query);

    res.json(reporte);

  } catch (error) {
    next(error);
  }
};

// 🔹 REPORTE OCUPACIÓN
exports.reporteOcupacionSalas = async (req, res, next) => {
  try {

    const reporte =
      await reservaService.reporteOcupacionSalas(req.query);

    res.json(reporte);

  } catch (error) {
    next(error);
  }
};

// 🔹 HISTORIAL DOCENTE
exports.historialDocente = async (req, res, next) => {

  try {

    const {
      idUsuario,
      fechaInicio,
      fechaFin,
      estado
    } = req.query;

    if (!idUsuario) {
      return res.status(400).json({
        error: 'Debe enviar el idUsuario'
      });
    }

    const reservas =
      await reservaService.historialDocente({

        idUsuario,
        fechaInicio,
        fechaFin,
        estado

      });

    res.json(
      reservas.map(r => new ReservaDTO(r))
    );

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