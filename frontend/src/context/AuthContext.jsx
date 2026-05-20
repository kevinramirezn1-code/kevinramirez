import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (correo, contraseña) => {
    try {
      const data = await api.login(correo, contraseña);

      if (data?.user && data?.token) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        return { success: true, user: data.user };
      }

      return { success: false, error: "Respuesta inválida del servidor" };
    } catch (error) {
      const message = error.response?.data?.message;
      return {
        success: false,
        error: Array.isArray(message)
          ? message.join(", ")
          : message || "Error al iniciar sesión",
      };
    }
  };

  const register = async (correo, contraseña, idFacultad) => {
    const data = await api.register(correo, contraseña, idFacultad);
    return data;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      await api.logout();
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);