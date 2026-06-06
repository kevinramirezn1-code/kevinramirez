const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const salaController = require('../controllers/salaController');
const authorize = require('../middlewares/roleMiddleware');

// 🔥 Middleware de validación
const validar = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  next();
};

// 🔹 CREAR
router.post('/', authorize('secretaria'), salaController.crear);

// 🔹 LISTAR (solo sus salas)
router.get('/', authorize('secretaria', 'docente'), salaController.listar);

// 🔹 OBTENER POR ID
router.get(
  '/:id',
  param('id').isString().notEmpty().withMessage('ID inválido'),
  validar,
  authorize('secretaria', 'docente'),
  salaController.obtenerPorId
);

// 🔹 ACTUALIZAR DATOS
router.put(
  '/:id/datos',
  param('id').isString().notEmpty().withMessage('ID inválido'),
  validar,
  authorize('secretaria'),
  salaController.actualizarDatos
);

// 🔹 ACTUALIZAR ESTADO
router.put(
  '/:id',
  param('id').isString().notEmpty().withMessage('ID inválido'),
  validar,
  authorize('secretaria'),
  salaController.actualizar
);

// 🔹 ELIMINAR
router.delete(
  '/:id',
  param('id').isString().notEmpty().withMessage('ID inválido'),
  validar,
  authorize('secretaria'),
  salaController.eliminar
);

module.exports = router;