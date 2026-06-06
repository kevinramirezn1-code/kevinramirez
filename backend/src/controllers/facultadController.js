const facultadService = require('../service/facultadService');

exports.listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const incluir = req.query.include === 'docentes,secretarias';
    const resultado = await facultadService.listar(page, limit, incluir);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

exports.obtenerPorId = async (req, res, next) => {
  try {
    const incluir = req.query.include === 'docentes,secretarias';
    const facultad = await facultadService.obtenerPorId(req.params.id, incluir);
    res.json(facultad);
  } catch (error) {
    next(error);
  }
};

exports.listarTodos = async (req, res, next) => {
  try {
    const facultades = await facultadService.listarTodos();
    res.json(facultades);
  } catch (error) {
    next(error);
  }
};