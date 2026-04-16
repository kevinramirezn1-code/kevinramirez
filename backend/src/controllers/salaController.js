const salaService = require('../service/salaService');
const SalaDTO = require('../dtos/salaDTO');
const { Sala } = require('../models');

// 🔹 CREAR
exports.crear = async (req, res, next) => {
  try {

    const errors = SalaDTO.validarCrear(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const {
      id,
      nombre,
      ubicacion,
      capacidad,
      estado
    } = req.body;

    const facultad_id = req.user.idFacultad; // 🔥 CLAVE

    const salaExistente = await Sala.findByPk(id);
    if (salaExistente) {
      return res.status(400).json({
        error: 'Ya existe una sala con ese ID'
      });
    }

    const sala = await salaService.crear({
      id,
      nombre,
      ubicacion,
      capacidad,
      estado,
      facultad_id
    });

    res.status(201).json(new SalaDTO(sala));

  } catch (error) {
    next(error);
  }
};

// 🔹 LISTAR (solo su facultad)
exports.listar = async (req, res, next) => {
  try {
    const facultad_id = req.user.idFacultad;

    const salas = await salaService.listarPorFacultad(facultad_id);

    res.json(salas.map(s => new SalaDTO(s)));
  } catch (error) {
    next(error);
  }
};

// 🔹 OBTENER
exports.obtenerPorId = async (req, res, next) => {
  try {
    const sala = await salaService.obtenerPorId(req.params.id);

    // 🔥 VALIDAR MISMA FACULTAD
    if (sala.facultad_id !== req.user.idFacultad) {
      return res.status(403).json({ error: 'No tienes acceso a esta sala' });
    }

    res.json(new SalaDTO(sala));
  } catch (error) {
    next(error);
  }
};

// 🔹 ACTUALIZAR ESTADO
exports.actualizar = async (req, res, next) => {
  try {
    const errors = SalaDTO.validarActualizar(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const sala = await salaService.obtenerPorId(req.params.id);

    if (sala.facultad_id !== req.user.idFacultad) {
      return res.status(403).json({ error: 'No tienes acceso' });
    }

    const updated = await salaService.actualizar(req.params.id, req.body);

    res.json(new SalaDTO(updated));

  } catch (error) {
    next(error);
  }
};

// 🔹 ACTUALIZAR DATOS
exports.actualizarDatos = async (req, res, next) => {
  try {
    const errors = SalaDTO.validarActualizarDatos(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const sala = await salaService.obtenerPorId(req.params.id);

    if (sala.facultad_id !== req.user.idFacultad) {
      return res.status(403).json({ error: 'No tienes acceso' });
    }

    const updated = await salaService.actualizar(req.params.id, req.body);

    res.json(new SalaDTO(updated));

  } catch (error) {
    next(error);
  }
};

// 🔹 ELIMINAR
exports.eliminar = async (req, res, next) => {
  try {
    const sala = await salaService.obtenerPorId(req.params.id);

    if (sala.facultad_id !== req.user.idFacultad) {
      return res.status(403).json({ error: 'No tienes acceso' });
    }

    await salaService.eliminar(req.params.id);

    res.json({ mensaje: 'Sala eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};