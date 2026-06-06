const salaRecursoService = require('../service/salaRecursoService');
const SalaRecursoDTO = require('../dtos/salaRecursoDTO');

const listarPorSala = async (req, res, next) => {
  try {
    const { idSala } = req.params;
    const recursos = await salaRecursoService.listarPorSala(idSala);
    res.json(recursos.map((r) => new SalaRecursoDTO(r)));
  } catch (error) {
    next(error);
  }
};

const agregar = async (req, res, next) => {
  try {
    const errors = SalaRecursoDTO.validarCrear(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const { id_sala, codigo, tipo, descripcion } = req.body;

    const resultado = await salaRecursoService.agregar({
      id_sala,
      codigo,
      tipo,
      descripcion
    });

    res.status(201).json(new SalaRecursoDTO(resultado));
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const errors = SalaRecursoDTO.validarEliminar(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errores: errors });
    }

    const { id_sala, id_recurso } = req.body;

    const resultado = await salaRecursoService.eliminarDeSala({
      id_sala,
      id_recurso
    });

    res.json(new SalaRecursoDTO(resultado));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarPorSala,
  agregar,
  eliminar
};