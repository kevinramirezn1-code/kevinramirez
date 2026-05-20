import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para añadir el token JWT a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- AUTH ----
export const login = async (correo, contraseña) => {
  const res = await api.post("/auth/login", { correo, contraseña });
  return res.data;  // { message, user, token }
};

export const register = async (correo, contraseña, idFacultad) => {
  const res = await api.post("/auth/register", { correo, contraseña, idFacultad });
  return res.data;  // { message, user }
};

export const logout = async () => {
  return api.post("/auth/logout").catch(() => {});
};

// ---- FACULTADES ----
export const getFacultades = async () => {
  const res = await api.get("/facultades/todas");
  return res.data;
};

// ---- SALAS ----
export const getSalas = async () => {
  const res = await api.get("/salas");
  return res.data;
};

export const createSala = async (data) => {
  const res = await api.post("/salas", data);
  return res.data;
};

export const updateSalaDatos = async (id, data) => {
  const res = await api.put(`/salas/${id}/datos`, data);
  return res.data;
};

export const updateSalaEstado = async (id, data) => {
  const res = await api.put(`/salas/${id}`, data);
  return res.data;
};

// ---- RESERVAS ----
export const getReservas = async (params) => {
  const res = await api.get("/reservas", { params });
  return res.data;
};

export const createReserva = async (data) => {
  const res = await api.post("/reservas", data);
  return res.data;
};

export const updateReserva = async (id, data) => {
  const res = await api.put(`/reservas/${id}`, data);
  return res.data;
};

export const cancelReserva = async (id) => {
  const res = await api.delete(`/reservas/${id}`);
  return res.data;
};

export const getHistorialFacultad = async (params) => {
  const res = await api.get("/reservas/historial/facultad", { params });
  return res.data;
};

export const getReporteReservas = async (numeroReservas) => {
  const res = await api.get("/reservas/reportes/reservas", { params: { numeroReservas } });
  return res.data;
};

export const getReporteDocentes = async (params) => {
  const res = await api.get("/reservas/reportes/docentes", { params });
  return res.data;
};

export const getReporteSalas = async (params) => {
  const res = await api.get("/reservas/reportes/salas", { params });
  return res.data;
};

export const getReporteOcupacion = async (params) => {
  const res = await api.get("/reservas/reportes/ocupacion", { params });
  return res.data;
};

// ---- USUARIOS ----
export const getUsuarios = async () => {
  const res = await api.get("/usuarios");
  return res.data;
};

export const getDocentesPorFacultad = async () => {
  const res = await api.get("/usuarios/docentes/mis-facultad");
  return res.data;
};

// ---- SALA RECURSOS ----
export const getRecursosSala = async (idSala) => {
  const res = await api.get(`/sala-recursos/sala/${idSala}`);
  return res.data;
};

export const addRecursoSala = async (data) => {
  const res = await api.post("/sala-recursos", data);
  return res.data;
};

export const eliminarRecursoDeSala = async (data) => {
  const res = await api.patch("/sala-recursos", data);
  return res.data;
};

export default api;