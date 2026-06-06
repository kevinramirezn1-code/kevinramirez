import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔄 Mientras valida sesión
  if (loading) return <p>Cargando...</p>;

  // 🔐 Si no hay usuario → login
  if (!user) return <Navigate to="/login" />;

  // ✅ Si hay usuario → deja pasar
  return children;
};

export default PrivateRoute;