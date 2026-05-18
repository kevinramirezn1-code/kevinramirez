const recursoService = require('../service/recursoService');
const RecursoDTO = require('../dtos/recursoDTO');

// 🔹 CREAR RECURSO
exports.crear = async (req, res, next) => {
  try {
    const errors = RecursoDTO.validarCrear(req.body);

    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const recurso = await recursoService.crear(req.body);
    res.status(201).json(new RecursoDTO(recurso));

  } catch (error) {
    next(error);
  }
};

// 🔹 LISTAR RECURSOS
exports.listar = async (req, res, next) => {
  try {
    const recursos = await recursoService.listar();
    res.json(recursos.map(r => new RecursoDTO(r)));
  } catch (error) {
    next(error);
  }
};

// 🔹 OBTENER POR ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const recurso = await recursoService.obtenerPorId(req.params.id);
    res.json(new RecursoDTO(recurso));
  } catch (error) {
    next(error);
  }
};

// 🔹 ELIMINAR
exports.eliminar = async (req, res, next) => {
  try {
    const resultado = await recursoService.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    next(error);
    console.log("Hola")
  }
};