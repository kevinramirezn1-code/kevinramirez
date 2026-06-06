const express = require('express');
const router = express.Router();
const recursoController = require('../controllers/recursoController');

router.post('/', recursoController.crear);
router.get('/', recursoController.listar);
router.get('/:id', recursoController.obtenerPorId);
router.delete('/:id', recursoController.eliminar);

module.exports = router;