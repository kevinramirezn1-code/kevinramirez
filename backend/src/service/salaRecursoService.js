const { Op } = require('sequelize');
const { Sala, Recurso, SalaRecurso, sequelize } = require('../models');

const parseCodigo = (codigo) => {
  if (typeof codigo !== 'string') {
    return null;
  }

  const normalized = codigo.trim().toUpperCase();
  const match = normalized.match(/^(.+?)-(\d+)$/);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    number: Number(match[2])
  };
};

const buildCodigo = (prefix, number) => `${prefix}-${String(number).padStart(3, '0')}`;

exports.listarPorSala = async (idSala) => {
  const sala = await Sala.findByPk(idSala, {
    include: {
      model: Recurso,
      as: 'recursos',
      through: {
        attributes: ['estado'],
        where: { estado: 'activo' }
      }
    }
  });

  if (!sala) {
    throw new Error('Sala no encontrada');
  }

  return sala.recursos.map((recurso) => ({
    id_sala: idSala,
    id_recurso: recurso.id,
    estado: recurso.SalaRecurso?.estado || null,
    tipo: recurso.tipo,
    descripcion: recurso.descripcion,
    codigo: recurso.codigo
  }));
};

exports.agregar = async ({ id_sala, codigo, tipo, descripcion }) => {
  return await sequelize.transaction(async (transaction) => {
    const sala = await Sala.findByPk(id_sala, { transaction });
    if (!sala) {
      throw new Error('Sala no encontrada');
    }

    // Verificar que el código no exista ya
    const recursoExistente = await Recurso.findOne({
      where: { codigo: codigo.toUpperCase() },
      transaction
    });

    if (recursoExistente) {
      throw new Error('El código del recurso ya existe');
    }

    // Crear el nuevo recurso con el código proporcionado
    const nuevoRecurso = await Recurso.create(
      {
        codigo: codigo.toUpperCase(),
        tipo,
        descripcion
      },
      { transaction }
    );

    // Crear la relación en sala_recursos
    await SalaRecurso.create(
      {
        id_sala,
        id_recurso: nuevoRecurso.id,
        estado: 'activo'
      },
      { transaction }
    );

    return {
      id_sala,
      id_recurso: nuevoRecurso.id,
      estado: 'activo',
      tipo: nuevoRecurso.tipo,
      descripcion: nuevoRecurso.descripcion,
      codigo: nuevoRecurso.codigo
    };
  });
};

exports.eliminarDeSala = async ({ id_sala, id_recurso }) => {
  if (!id_sala || typeof id_sala !== 'string') {
    throw new Error('id_sala es obligatorio y debe ser texto');
  }

  if (!id_recurso || isNaN(id_recurso)) {
    throw new Error('id_recurso es obligatorio y debe ser numérico');
  }

  return await sequelize.transaction(async (transaction) => {
    const salaRecurso = await SalaRecurso.findOne({
      where: {
        id_sala,
        id_recurso,
        estado: 'activo'
      },
      transaction
    });

    if (!salaRecurso) {
      throw new Error('El recurso no está activo en esta sala');
    }

    salaRecurso.estado = 'inactivo';
    await salaRecurso.save({ transaction });

    const recurso = await Recurso.findByPk(id_recurso, { transaction });

    return {
      id_sala,
      id_recurso,
      estado: 'inactivo',
      tipo: recurso?.tipo || null,
      descripcion: recurso?.descripcion || null,
      codigo: recurso?.codigo || null,
      cantidad: 1
    };
  });
};