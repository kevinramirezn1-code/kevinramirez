const { Op } = require('sequelize');
const { Sala, Recurso, SalaRecurso, sequelize } = require('../models');

// 🔹 Funciones auxiliares (por si luego las usas)
const parseCodigo = (codigo) => {
  if (typeof codigo !== 'string') return null;

  const normalized = codigo.trim().toUpperCase();
  const match = normalized.match(/^(.+?)-(\d+)$/);

  if (!match) return null;

  return {
    prefix: match[1],
    number: Number(match[2])
  };
};

const buildCodigo = (prefix, number) =>
  `${prefix}-${String(number).padStart(3, '0')}`;

// 🔹 LISTAR RECURSOS POR SALA
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

// 🔹 AGREGAR / REACTIVAR RECURSO EN SALA
exports.agregar = async ({ id_sala, codigo, tipo, descripcion }) => {
  return await sequelize.transaction(async (transaction) => {

    const sala = await Sala.findByPk(id_sala, { transaction });
    if (!sala) {
      throw new Error('Sala no encontrada');
    }

    const codigoUpper = codigo.trim().toUpperCase();

    // 🔍 Buscar recurso (normalizado)
    let recurso = await Recurso.findOne({
      where: sequelize.where(
        sequelize.fn('UPPER', sequelize.fn('TRIM', sequelize.col('codigo'))),
        codigoUpper
      ),
      transaction
    });

    // 👉 Si no existe → crear
    if (!recurso) {
      recurso = await Recurso.create({
        codigo: codigoUpper,
        tipo,
        descripcion
      }, { transaction });
    }

    // 🚫 Validar que NO esté activo en otra sala
    const activoEnOtraSala = await SalaRecurso.findOne({
      where: {
        id_recurso: recurso.id,
        estado: 'activo',
        id_sala: { [Op.ne]: id_sala }
      },
      transaction
    });

    if (activoEnOtraSala) {
      throw new Error('El recurso ya está activo en otra sala');
    }

    // 🔍 Buscar relación con la sala actual
    let salaRecurso = await SalaRecurso.findOne({
      where: {
        id_sala,
        id_recurso: recurso.id
      },
      transaction
    });

    if (salaRecurso) {
      if (salaRecurso.estado === 'activo') {
        throw new Error('El recurso ya está activo en esta sala');
      }

      // 🔁 Reactivar
      salaRecurso.estado = 'activo';
      await salaRecurso.save({ transaction });

    } else {
      // ➕ Crear relación nueva
      await SalaRecurso.create({
        id_sala,
        id_recurso: recurso.id,
        estado: 'activo'
      }, { transaction });
    }

    return {
      id_sala,
      id_recurso: recurso.id,
      estado: 'activo',
      tipo: recurso.tipo,
      descripcion: recurso.descripcion,
      codigo: recurso.codigo
    };
  });
};

// 🔹 ELIMINAR (CAMBIAR A INACTIVO)
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

    // 🔁 Desactivar
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