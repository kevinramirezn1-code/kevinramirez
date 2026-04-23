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

    if (!data.tipo || data.tipo.toString().trim() === '') {
      errors.push('El tipo es obligatorio');
    } else {
      const tipo = data.tipo.toString().trim();

      if (tipo.length > 45) {
        errors.push('El tipo no puede tener más de 45 caracteres');
      } else if (/^\d+$/.test(tipo)) {
        errors.push('El tipo no puede ser solo números');
      }
    }

    if (data.descripcion) {
      const desc = data.descripcion.toString().trim();

      if (desc.length > 100) {
        errors.push('La descripción no puede tener más de 100 caracteres');
      } else if (/^\d+$/.test(desc)) {
        errors.push('La descripción no puede ser solo números');
      }
    }

    return errors;
  }
}

module.exports = RecursoDTO;