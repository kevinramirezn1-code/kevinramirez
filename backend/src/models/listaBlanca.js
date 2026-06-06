module.exports = (sequelize, DataTypes) => {
  const ListaBlanca = sequelize.define('ListaBlanca', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    correo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    }
  }, {
    tableName: 'lista_blanca',
    timestamps: false
  });

  return ListaBlanca;
};