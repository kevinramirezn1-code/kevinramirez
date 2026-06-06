const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const facultadController = require('../controllers/facultadController');

router.get('/', facultadController.listar);
router.get('/todas', facultadController.listarTodos);
router.get('/:id', param('id').isInt(), facultadController.obtenerPorId);

module.exports = router;