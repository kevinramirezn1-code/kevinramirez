class ReservaDTO {
  constructor({ id, fechaInicio, fechaFin, idUsuario, idSala, estado }) {
    this.id = id;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.idUsuario = idUsuario;
    this.idSala = idSala;
    this.estado = estado;
  }

  static validarCrear(data) {
    const errors = [];

    if (!data.fechaInicio) errors.push('La fecha de inicio es obligatoria');
    if (!data.fechaFin) errors.push('La fecha de fin es obligatoria');

    if (!data.idUsuario) {
      errors.push('El usuario es obligatorio');
    } else if (isNaN(data.idUsuario)) {
      errors.push('El idUsuario debe ser numérico');
    }

    if (!data.idSala) {
      errors.push('La sala es obligatoria');
    }

    // validación lógica de fechas
    if (data.fechaInicio && data.fechaFin) {
      if (new Date(data.fechaFin) <= new Date(data.fechaInicio)) {
        errors.push('La fecha fin debe ser mayor a la fecha inicio');
      }
    }

    return errors;
  }

  static validarActualizar(data) {
    const errors = [];

    if (!data || Object.keys(data).length === 0) {
      errors.push('Debe enviar al menos un campo');
      return errors;
    }

    // validar fechas si vienen
    if (data.fechaInicio && data.fechaFin) {
      if (new Date(data.fechaFin) <= new Date(data.fechaInicio)) {
        errors.push('La fecha fin debe ser mayor a la fecha inicio');
      }
    }

    // validar idUsuario si viene
    if (data.idUsuario && isNaN(data.idUsuario)) {
      errors.push('El idUsuario debe ser numérico');
    }

    return errors;
  }
}

module.exports = ReservaDTO;