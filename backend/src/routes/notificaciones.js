const express = require('express');
const router = express.Router();

const notificacionController =
require('../controllers/notificacionController');

router.get(
  '/:idDocente',
  notificacionController.obtenerNotificaciones
);

module.exports = router;