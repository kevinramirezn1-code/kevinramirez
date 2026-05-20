import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import InicioDocente from '../pages/InicioDocente';
import InicioSecretaria from '../pages/InicioSecretaria';
import GestionarReservas from '../pages/GestionarReservas';
import GestionarSalas from '../pages/GestionarSalas';
import Reportes from '../pages/Reportes';

// Componente de protección genérico
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando sesión...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Ruta protegida por rol específico
const RoleRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== allowedRole) return <Navigate to="/login" replace />;

  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Rutas protegidas por rol */}
      <Route
        path="/docente"
        element={
          <RoleRoute allowedRole="docente">
            <InicioDocente />
          </RoleRoute>
        }
      />
      <Route
        path="/secretaria"
        element={
          <RoleRoute allowedRole="secretaria">
            <InicioSecretaria />
          </RoleRoute>
        }
      />

      {/* Rutas genéricas (cualquier usuario autenticado) */}
      <Route
        path="/inicio/GestionarSala"
        element={
          <PrivateRoute>
            <GestionarSalas />
          </PrivateRoute>
        }
      />
      <Route
        path="/inicio/GestionarReservas"
        element={
          <PrivateRoute>
            <GestionarReservas />
          </PrivateRoute>
        }
      />
      <Route
        path="/inicio/Reportes"
        element={
          <PrivateRoute>
            <Reportes />
          </PrivateRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;