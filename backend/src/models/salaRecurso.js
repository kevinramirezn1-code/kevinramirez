module.exports = (sequelize, DataTypes) => {
  const SalaRecurso = sequelize.define('SalaRecurso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_recurso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'activo'
    }
  }, {
    tableName: 'sala_recursos',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_sala', 'id_recurso']
      }
    ]
  });

  return SalaRecurso;
};