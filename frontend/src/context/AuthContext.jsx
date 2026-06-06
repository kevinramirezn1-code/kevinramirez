import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 🔹 LOGIN
  // 🔹 LOGIN
const login = async (correo, contraseña) => {
  try {
    const data = await api.login(correo, contraseña);

    if (data?.user) {
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    }

    return { success: false, error: 'Respuesta inválida' };

  } catch (error) {

    const message =
      error.response?.data?.message;

    return {
      success: false,
      error: Array.isArray(message)
        ? message.join(", ")
        : message || 'Error al iniciar sesión'
    };
  }
};

  // 🔹 REGISTER
  const register = async (correo, contraseña, idFacultad) => {
    try {
      return await api.register(correo, contraseña, idFacultad);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
    try {
      await api.logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);