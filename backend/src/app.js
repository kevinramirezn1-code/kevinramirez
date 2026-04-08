const express = require('express');
const cors = require('cors');
const session = require('express-session');

const authRoutes = require('./routes/authRoutes');
const facultadRoutes = require('./routes/facultadRoutes');
const salaRoutes = require('./routes/salaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const recursoRoutes = require('./routes/recursoRoutes');
const salaRecursoRoutes = require('./routes/salaRecursosRoutes');

const app = express();

// 🔥 CORS PARA COOKIES
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// 🔥 SESIÓN
app.use(session({
  secret: 'secreto_super_seguro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en producción con HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 8 // 8 horas
  }
}));

// 🔹 Rutas
app.use('/api/auth', authRoutes);
app.use('/api/facultades', facultadRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/sala-recursos', salaRecursoRoutes);

// 🔥 Error global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno'
  });
});

// 🔥 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;