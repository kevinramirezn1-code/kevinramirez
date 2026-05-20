module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {

    // 🔐 Verificar autenticación JWT
    if (!req.user) {
      return res.status(401).json({
        message: ['No autenticado']
      });
    }

    const usuario = req.user;

    // 🔐 Verificar rol
    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({
        message: ['No tienes permisos']
      });
    }

    // 🔥 adjuntar usuario (already set by JWT middleware)
    next();
  };
};