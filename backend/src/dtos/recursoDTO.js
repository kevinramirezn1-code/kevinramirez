class RecursoDTO {

  constructor({ id, codigo, tipo, descripcion }) {
    this.id = id;
    this.codigo = codigo;
    this.tipo = tipo;
    this.descripcion = descripcion;
  }

  static validarCrear(data) {
    const errors = [];

    if (!data.codigo) errors.push('El código es obligatorio');
    else if (data.codigo.length > 45) errors.push('El código no puede tener más de 45 caracteres');

    if (!data.tipo) errors.push('El tipo es obligatorio');
    else if (data.tipo.length > 45) errors.push('El tipo no puede tener más de 45 caracteres');

    if (data.descripcion && data.descripcion.length > 100) {
      errors.push('La descripción no puede tener más de 100 caracteres');
    }

    return errors;
  }
}

module.exports = RecursoDTO;