module.exports = (sequelize, DataTypes) => {
  const Recurso = sequelize.define('Recurso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    codigo: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      set(value) {
        if (typeof value === 'string') {
          this.setDataValue('codigo', value.trim().toUpperCase());
        } else {
          this.setDataValue('codigo', value);
        }
      }
    },
    tipo: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'recursos',
    timestamps: false
  });

  return Recurso;
};