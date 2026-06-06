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
  const errors = [];

  if (!data.id_sala || isNaN(data.id_sala)) {
    errors.push("La sala es obligatoria");
  }

  if (!data.codigo || data.codigo.toString().trim() === '') {
    errors.push('El c贸digo es obligatorio');
  } else {
    const codigo = data.codigo.toString().trim();

    if (codigo.length > 45) {
      errors.push('El c贸digo no puede tener m谩s de 45 caracteres');
    } else if (!/[a-zA-Z]/.test(codigo)) {
      errors.push('El c贸digo debe contener al menos una letra');
    }
  }

  if (!data.tipo || data.tipo.toString().trim() === '') {
    errors.push('El tipo es obligatorio');
  } else {
    const tipo = data.tipo.toString().trim();

    if (tipo.length > 45) {
      errors.push('El tipo no puede tener m谩s de 45 caracteres');
    } else if (!/[a-zA-Z]/.test(tipo)) {
      errors.push('El tipo debe contener al menos una letra');
    }
  }

  if (!data.descripcion || data.descripcion.toString().trim() === '') {
    errors.push('La descripci贸n es obligatoria');
  } else {
    const desc = data.descripcion.toString().trim();

    if (desc.length > 100) {
      errors.push('La descripci贸n no puede tener m谩s de 100 caracteres');
    } else if (!/[a-zA-Z]/.test(desc)) {
      errors.push('La descripci贸n debe contener al menos una letra');
    }
  }

  return errors;
}

  static validarEliminar(data) {
    const errores = [];

    if (!data.id_sala || isNaN(data.id_sala)) {
      errores.push('id_sala es obligatorio y debe ser numérico');
    }

    if (!data.id_recurso || isNaN(data.id_recurso)) {
      errores.push('id_recurso es obligatorio y debe ser num茅rico');
    }

    return errores;
  }
}

module.exports = SalaRecursoDTO;