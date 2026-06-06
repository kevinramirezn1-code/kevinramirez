import axios from 'axios';

// 🔥 BASE URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// 🔥 INSTANCIA AXIOS (CLAVE PARA SESIÓN)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 ESTO MANTIENE LA SESIÓN
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔹 LOGIN
// 🔹 LOGIN
export const login = async (correo, contraseña) => {
  try {
    const res = await api.post('/auth/login', {
      correo,
      contraseña
    });
    return res.data;
  } catch (error) {
    throw error; // ✅ deja el error original
  }
};

// 🔹 REGISTER
export const register = async (correo, contraseña, idFacultad) => {
  try {
    const res = await api.post('/auth/register', {
      correo,
      contraseña,
      idFacultad
    });
    return res.data;
  } catch (error) {
    throw error; // ✅ NO transformar
  }
};

// 🔹 VALIDAR SESIÓN (🔥 CORREGIDO)
export const getSession = async () => {
  try {
    const res = await api.get('/auth/session'); // 🔥 IMPORTANTE
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'No autenticado'
    );
  }
};

// 🔹 LOGOUT
export const logout = async () => {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al cerrar sesión'
    );
  }
};

// 🔹 FACULTADES
export const getFacultades = async () => {
  try {
    const res = await api.get('/facultades/todas');
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al obtener facultades'
    );
  }
};

export const getRecursosPorSala = async (idSala) => {
  const res = await fetch(`${API_URL}/sala-recursos/sala/${idSala}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al obtener recursos de la sala');
  }
  return res.json();
};

export const eliminarRecursoDeSala = async ({ id_sala, id_recurso }) => {
  const res = await fetch(`${API_URL}/sala-recursos`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_sala, id_recurso }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al eliminar el recurso de la sala');
  }
  return data;
};
export default api;