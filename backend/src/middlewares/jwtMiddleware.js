const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // No token provided, continue without authentication
    return next();
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    // Malformed authorization header, continue without authentication
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro_cambiar_en_produccion';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    // Invalid token, continue without authentication (will be caught by roleMiddleware if needed)
    return next();
  }
};

module.exports = authenticateJWT;
