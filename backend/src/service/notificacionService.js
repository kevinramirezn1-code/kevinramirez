const {
  AuditoriaReserva,
  Sala
} = require('../models');

class NotificacionService {

  async obtenerNotificaciones(idDocente) {

    return await AuditoriaReserva.findAll({

      where: {
        id_docente_afectado: idDocente
      },

      include: [

        {
          model: Sala,
          as: 'salaNueva',
          foreignKey: 'idSala_despues'
        },

        {
          model: Sala,
          as: 'salaAnterior',
          foreignKey: 'idSala_antes'
        }

      ],

      order: [
        ['fecha_cambio', 'DESC']
      ]

    });

  }

}

module.exports = new NotificacionService();