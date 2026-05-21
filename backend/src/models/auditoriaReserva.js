module.exports = (sequelize, DataTypes) => {
  const AuditoriaReserva = sequelize.define('AuditoriaReserva', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_reserva: {
      type: DataTypes.INTEGER
    },

    id_docente_afectado: {
      type: DataTypes.INTEGER
    },

    fechaInicio_antes: {
      type: DataTypes.DATE
    },

    fechaFin_antes: {
      type: DataTypes.DATE
    },

    idSala_antes: {
      type: DataTypes.INTEGER
    },

    estado_antes: {
      type: DataTypes.STRING
    },

    fechaInicio_despues: {
      type: DataTypes.DATE
    },

    fechaFin_despues: {
      type: DataTypes.DATE
    },

    idSala_despues: {
      type: DataTypes.INTEGER
    },

    estado_despues: {
      type: DataTypes.STRING
    },

    accion: {
      type: DataTypes.STRING
    },

    fecha_cambio: {
      type: DataTypes.DATE
    }

  }, {
    tableName: 'auditoria_reservas',
    timestamps: false
  });

  return AuditoriaReserva;
};