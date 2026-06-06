const express = require('express');
const cors = require('cors');
const session = require('express-session'); // <-- Importar
const facultadRoutes = require('./routes/facultadRoutes');
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();

// Configuración de CORS para permitir cookies
app.use(cors({
  origin: 'http://localhost:3000', // tu frontend
  credentials: true // permitir envío de cookies
}));

app.use(express.json());

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'un_secreto_muy_seguro_cambiar_en_produccion',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en producción con HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 horas (igual que el token)
  }
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/facultades', facultadRoutes);
app.use('/reservas', reservaRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Error interno del servidor',
      status: err.status || 500
    }
  });
});

module.exports = app;