const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Facultad = require('./facultad')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);
const ListaBlanca = require('./listaBlanca')(sequelize, DataTypes);
const Sala = require('./sala')(sequelize, DataTypes);
const Reserva = require('./reserva')(sequelize, DataTypes);
const Recurso = require('./recurso')(sequelize, DataTypes);
const SalaRecurso = require('./salaRecurso')(sequelize, DataTypes);
const AuditoriaReserva = require('./auditoriaReserva')(sequelize, DataTypes);

// ✅ DEFINE db PRIMERO
const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Facultad,
  Usuario,
  ListaBlanca,
  Sala,
  Reserva,
  Recurso,
  SalaRecurso,
  AuditoriaReserva
};

// 🔥 RELACIONES

AuditoriaReserva.belongsTo(Sala, {
  foreignKey: 'idSala_despues',
  as: 'salaNueva'
});

AuditoriaReserva.belongsTo(Sala, {
  foreignKey: 'idSala_antes',
  as: 'salaAnterior'
});

Facultad.hasMany(Sala, {
  foreignKey: 'facultad_id'
});

Sala.belongsTo(Facultad, {
  foreignKey: 'facultad_id'
});

Sala.hasMany(Reserva, {
  foreignKey: 'idSala'
});


Reserva.belongsTo(Sala, {
  foreignKey: 'idSala'
});

Facultad.hasMany(Usuario, {
  foreignKey: 'idFacultad'
});

Usuario.belongsTo(Facultad, {
  foreignKey: 'idFacultad'
});

Usuario.hasMany(Reserva, {
  foreignKey: 'idUsuario',
  as: 'reservas'
});

Reserva.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

Reserva.belongsTo(Sala, {
  foreignKey: 'idSala',
  as: 'sala'
});

Sala.hasMany(Reserva, {
  foreignKey: 'idSala',
  as: 'reservas'
});

// 🔥 AHORA SÍ puedes usar db
Object.keys(db).forEach(modelName => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 🔥 MANY TO MANY
Sala.belongsToMany(Recurso, {
  through: SalaRecurso,
  foreignKey: 'id_sala',
  otherKey: 'id_recurso',
  as: 'recursos'
});

Recurso.belongsToMany(Sala, {
  through: SalaRecurso,
  foreignKey: 'id_recurso',
  otherKey: 'id_sala'
});

module.exports = db;