class RecursoDTO {
  constructor({ id, codigo, tipo, descripcion }) {
    this.id = id;
    this.codigo = codigo;
    this.tipo = tipo;
    this.descripcion = descripcion;
  }

  static validarCrear(data) {
    const errors = [];

    // 🔹 Validar código
    if (!data.codigo || data.codigo.toString().trim() === '') {
      errors.push('El código es obligatorio');
    } else {
      const codigo = data.codigo.toString().trim();

      if (codigo.length > 45) {
        errors.push('El código no puede tener más de 45 caracteres');
      } else if (!/[a-zA-Z]/.test(codigo)) {
        errors.push('El código debe contener al menos una letra');
      }
    }

    // 🔹 Validar tipo
    if (!data.tipo || data.tipo.toString().trim() === '') {
      errors.push('El tipo es obligatorio');
    } else {
      const tipo = data.tipo.toString().trim();

      if (tipo.length > 45) {
        errors.push('El tipo no puede tener más de 45 caracteres');
      } else if (!/[a-zA-Z]/.test(tipo)) {
        errors.push('El tipo debe contener al menos una letra');
      }
    }

    // 🔹 Validar descripción
    if (data.descripcion !== undefined && data.descripcion !== null) {
      const desc = data.descripcion.toString().trim();

      if (desc.length > 100) {
        errors.push('La descripción no puede tener más de 100 caracteres');
      } else if (!/[a-zA-Z]/.test(desc)) {
        errors.push('La descripción debe contener al menos una letra');
      }
    }

    return errors;
  }
}

module.exports = RecursoDTO;