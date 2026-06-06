const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {

    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const usuario = req.session.user;

    if (!rolesPermitidos.includes(usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    req.user = usuario;

    next();
  };
};

module.exports = authorize;