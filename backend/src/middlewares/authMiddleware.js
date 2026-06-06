module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {

    // 🔐 Verificar sesión
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        message: ['No autenticado']
      });
    }

    const usuario = req.session.user;

    // 🔐 Verificar rol
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        message: ['No tienes permisos']
      });
    }

    // 🔥 adjuntar usuario
    req.user = usuario;

    next();
  };
};