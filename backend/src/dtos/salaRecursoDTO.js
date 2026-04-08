class SalaRecursoDTO {
  constructor(data) {
    this.id_sala = data.id_sala;
    this.id_recurso = data.id_recurso;
    this.estado = data.estado || null;
    this.codigo = data.codigo || null;
    this.tipo = data.tipo || null;
    this.descripcion = data.descripcion || null;
  }

  static validarCrear(data) {
    const errores = [];

    if (!data.id_sala || typeof data.id_sala !== 'string') {
      errores.push('id_sala es obligatorio y debe ser texto');
    }

    if (!data.codigo || typeof data.codigo !== 'string') {
      errores.push('codigo es obligatorio y debe ser texto');
    }

    if (!data.tipo || typeof data.tipo !== 'string') {
      errores.push('tipo es obligatorio y debe ser texto');
    }

    if (!data.descripcion || typeof data.descripcion !== 'string') {
      errores.push('descripcion es obligatorio y debe ser texto');
    }

    if (data.estado !== undefined && typeof data.estado !== 'string') {
      errores.push('estado debe ser texto');
    }

    return errores;
  }

  static validarEliminar(data) {
    const errores = [];

    if (!data.id_sala || typeof data.id_sala !== 'string') {
      errores.push('id_sala es obligatorio y debe ser texto');
    }

    if (!data.id_recurso || isNaN(data.id_recurso)) {
      errores.push('id_recurso es obligatorio y debe ser numérico');
    }

    return errores;
  }
}

module.exports = SalaRecursoDTO;