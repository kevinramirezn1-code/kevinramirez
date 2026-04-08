const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const salaRecursoController = require('../controllers/salaRecursoController');

const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

router.get(
  '/sala/:idSala',
  param('idSala').isString().notEmpty(),
  validar,
  salaRecursoController.listarPorSala
);

router.post(
  '/',
  body('id_sala').isString().notEmpty(),
  body('codigo').isString().notEmpty(),
  body('tipo').isString().notEmpty(),
  body('descripcion').isString().notEmpty(),
  validar,
  salaRecursoController.agregar
);

router.patch(
  '/',
  body('id_sala').isString().notEmpty(),
  body('id_recurso').isInt({ min: 1 }),
  validar,
  salaRecursoController.eliminar
);

module.exports = router;