module.exports = (sequelize, DataTypes) => {
  const Facultad = sequelize.define('Facultad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    decano: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'facultad',
    timestamps: false
  });

  Facultad.associate = (models) => {
    Facultad.hasMany(models.Usuario, {
      foreignKey: 'idFacultad',
      as: 'usuarios'
    });
  };

  return Facultad;
};