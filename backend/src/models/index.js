const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// 🔹 MODELOS
const Facultad = require('./facultad')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);
const ListaBlanca = require('./listaBlanca')(sequelize, DataTypes);
const Sala = require('./sala')(sequelize, DataTypes);
const Reserva = require('./reserva')(sequelize, DataTypes);
const Recurso = require('./recurso')(sequelize, DataTypes);
const SalaRecurso = require('./salaRecurso')(sequelize, DataTypes);

// 🔹 DB
const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Facultad,
  Usuario,
  ListaBlanca,
  Sala,
  Reserva,
  Recurso,
  SalaRecurso
};

// =========================
// 🔥 RELACIONES (SIN DUPLICADOS)
// =========================

// Facultad -> Sala
Facultad.hasMany(Sala, {
  foreignKey: 'facultad_id',
  as: 'salas'
});

Sala.belongsTo(Facultad, {
  foreignKey: 'facultad_id',
  as: 'facultad'
});

// Facultad -> Usuario
Facultad.hasMany(Usuario, {
  foreignKey: 'idFacultad',
  as: 'usuarios'
});

Usuario.belongsTo(Facultad, {
  foreignKey: 'idFacultad',
  as: 'facultad'
});

// Usuario -> Reserva
Usuario.hasMany(Reserva, {
  foreignKey: 'idUsuario',
  as: 'reservas'
});

Reserva.belongsTo(Usuario, {
  foreignKey: 'idUsuario',
  as: 'usuario'
});

// Sala -> Reserva
Sala.hasMany(Reserva, {
  foreignKey: 'idSala',
  as: 'reservas'
});

Reserva.belongsTo(Sala, {
  foreignKey: 'idSala',
  as: 'sala'
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
  otherKey: 'id_sala',
  as: 'salas'
});

// =========================
// 🔥 EXPORT
// =========================
module.exports = db;