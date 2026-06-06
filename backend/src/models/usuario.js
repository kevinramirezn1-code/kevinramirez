module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    correo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    idFacultad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'usuario',
    timestamps: false
  });

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Facultad, {
      foreignKey: 'idFacultad',
      as: 'facultad'
    });
  };

  return Usuario;
};