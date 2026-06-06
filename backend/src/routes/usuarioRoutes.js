const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const authorize = require('../middlewares/roleMiddleware');

// 🔐 Solo secretaria
router.get('/',
  authorize('secretaria'),
  usuarioController.listar
);

router.get('/:id',
  param('id').isInt(),
  authorize('secretaria', 'docente'),
  usuarioController.obtenerPorId
);

router.get(
  "/docentes/mis-facultad",
  authorize("secretaria"),
  usuarioController.obtenerDocentesPorFacultad
);

router.put('/:id',
  param('id').isInt(),
  authorize('secretaria'),
  usuarioController.actualizar
);

router.delete('/:id',
  param('id').isInt(),
  authorize('secretaria'),
  usuarioController.eliminar
);

module.exports = router;