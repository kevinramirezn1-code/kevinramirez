const notificacionService = require('../service/notificacionService');

exports.obtenerNotificaciones = async (req, res, next) => {

  try {

    const { idDocente } = req.params;

    const notificaciones =
      await notificacionService.obtenerNotificaciones(idDocente);

    res.json(notificaciones);

  } catch (error) {

    next(error);

  }

};