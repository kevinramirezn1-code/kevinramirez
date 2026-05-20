class UsuarioDTO {

  constructor(data) {
    const usuario = data.dataValues ? data.dataValues : data;

    this.id = usuario.id;
    this.correo = usuario.correo;
    this.rol = usuario.rol;
    this.idFacultad = usuario.idFacultad;

    this.facultad_nombre = usuario.facultad?.nombre || null;
    this.facultad = usuario.facultad ? { id: usuario.facultad.id, nombre: usuario.facultad.nombre } : null;
  }

  static validarCrear(data) {
    const errors = [];

    // 🔹 CORREO
    if (!data.correo || data.correo.trim() === '') {
      errors.push('El correo es obligatorio');
    } else {
      const correo = data.correo.trim().toLowerCase();
      // Validar formato básico de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        errors.push('El correo no tiene un formato válido');
      } else if (!correo.endsWith('@uao.edu.co')) {
        errors.push('Solo se permiten correos institucionales (@uao.edu.co)');
      }
    }

    // 🔹 CONTRASEÑA
    if (!data.contraseña || data.contraseña.trim() === '') {
      errors.push('La contraseña es obligatoria');
    } else {
      const password = data.contraseña;

      if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
      }

      if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe tener al menos una letra mayúscula');
      }

      if (!/\d/.test(password)) {
        errors.push('La contraseña debe tener al menos un número');
      }

      if (!/[@$!%*?&.#_-]/.test(password)) {
        errors.push('La contraseña debe tener al menos un carácter especial (@$!%*?&.#_-)');
      }
    }

    // 🔹 FACULTAD
    if (!data.idFacultad) {
      errors.push('La facultad es obligatoria');
    }

    return errors;
  }

  static validarLogin(data) {
    const errors = [];

    if (!data.correo || data.correo.trim() === '') {
      errors.push('El correo es obligatorio');
    }

    if (!data.contraseña || data.contraseña.trim() === '') {
      errors.push('La contraseña es obligatoria');
    }

    return errors;
  }
}

module.exports = UsuarioDTO;