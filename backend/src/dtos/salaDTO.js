class SalaDTO {

  constructor({ id, nombre, ubicacion, capacidad, estado, facultad_id }) {
    this.id = id;
    this.nombre = nombre;
    this.ubicacion = ubicacion;
    this.capacidad = capacidad;
    this.estado = estado;
    this.facultad_id = facultad_id;
  }

  // 🔥 VALIDACIÓN COMPLETA
  static esTextoValido(texto) {
    if (typeof texto !== 'string') return false;

    const limpio = texto.trim();

    // Permite letras, números, espacios y guion
    const formatoValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/.test(limpio);

    // Obliga al menos una letra
    const tieneLetra = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(limpio);

    return formatoValido && tieneLetra;
  }

  static validarCrear(data) {
    const errors = [];

    if (!data) {
      errors.push('Debe enviar datos');
      return errors;
    }

    if (!data.id || data.id.toString().trim() === '') {
      errors.push('El id es obligatorio y debe tener al menos 1 carácter');
    } else if (/^\d+$/.test(data.id.toString())) {
      errors.push('El id no puede ser solo números');
    }

    if (!data.nombre || data.nombre.trim() === '') {
      errors.push('El nombre es obligatorio');
    } else if (!this.esTextoValido(data.nombre)) {
      errors.push('El nombre no puede ser solo números');
    }

    if (!data.ubicacion || data.ubicacion.trim() === '') {
      errors.push('La ubicación es obligatoria');
    } else if (!this.esTextoValido(data.ubicacion)) {
      errors.push('La ubicación debe contener al menos una letra');
    }

    if (
      data.capacidad == null ||
      !Number.isInteger(Number(data.capacidad)) ||
      Number(data.capacidad) <= 1
    ) {
      errors.push('La capacidad debe ser un número mayor a 1');
    }

    if (!data.estado) errors.push('El estado es obligatorio');

    return errors;
  }

  static validarActualizar(data) {
    const errors = [];

    if (!data || Object.keys(data).length === 0) {
      errors.push('Debe enviar datos');
      return errors;
    }

    if (data.estado !== undefined) {
      if (typeof data.estado !== 'string' || data.estado.trim() === '') {
        errors.push('Estado inválido');
      }
    }

    return errors;
  }

  static validarActualizarDatos(data) {
    const errors = [];

    if (!data) {
      errors.push('Debe enviar datos');
      return errors;
    }

    if (!data.nombre || data.nombre.trim() === '') {
      errors.push('Nombre requerido');
    } else if (!this.esTextoValido(data.nombre)) {
      errors.push('El nombre no puede ser solo números');
    }

    if (!data.ubicacion || data.ubicacion.trim() === '') {
      errors.push('Ubicación requerida');
    } else if (!this.esTextoValido(data.ubicacion)) {
      errors.push('La ubicación debe contener al menos una letra');
    }

    if (
      data.capacidad == null ||
      !Number.isInteger(Number(data.capacidad)) ||
      Number(data.capacidad) <= 1
    ) {
      errors.push('La capacidad debe ser un número mayor a 1');
    }

    return errors;
  }
}

module.exports = SalaDTO;