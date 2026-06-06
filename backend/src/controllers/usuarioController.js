const usuarioService = require('../service/usuarioService');
const UsuarioDTO = require('../dtos/usuarioDTO');

// 🔹 LISTAR
exports.listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resultado = await usuarioService.listar(page, limit);

    res.json({
      ...resultado,
      items: resultado.items.map(u => new UsuarioDTO(u.toJSON()))
    });

  } catch (error) {
    next(error);
  }
};

// 🔹 OBTENER POR ID
exports.obtenerPorId = async (req, res, next) => {
  try {
    const usuario = await usuarioService.obtenerPorId(req.params.id);
    res.json(new UsuarioDTO(usuario.toJSON()));
  } catch (error) {
    next(error);
  }
};

// 🔥 CREAR USUARIO (CON VALIDACIÓN)
exports.crear = async (req, res, next) => {
  try {
    const errores = UsuarioDTO.validarCrear(req.body);

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const usuario = await usuarioService.crear(req.body);

    res.json(new UsuarioDTO(usuario.toJSON()));

  } catch (error) {
    next(error);
  }
};

// 🔥 ACTUALIZAR (VALIDA SOLO SI CAMBIA CONTRASEÑA)
exports.actualizar = async (req, res, next) => {
  try {
    if (req.body.contraseña) {
      const errores = UsuarioDTO.validarCrear(req.body);

      if (errores.length > 0) {
        return res.status(400).json({ errores });
      }
    }

    const usuario = await usuarioService.actualizar(req.params.id, req.body);
    res.json(new UsuarioDTO(usuario.toJSON()));

  } catch (error) {
    next(error);
  }
};

exports.obtenerDocentesPorFacultad = async (req, res, next) => {
  try {
    const usuario = req.user; // 🔥 viene del middleware

    // 🔐 SOLO secretaria puede usar esto
    if (usuario.rol !== "secretaria") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const docentes = await usuarioService.obtenerDocentesPorFacultad(
      usuario.idFacultad
    );

    res.json(docentes);

  } catch (error) {
    next(error);
  }
};

// 🔹 ELIMINAR
exports.eliminar = async (req, res, next) => {
  try {
    const resultado = await usuarioService.eliminar(req.params.id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};