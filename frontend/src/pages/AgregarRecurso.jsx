import { useState, useEffect } from "react";
import NavbarGestionSalas from "../components/NavbarGestionSalas";
import FooterRojo from "../components/FooterRojo";
import "../styles/AgregarRecurso.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// ── Funciones de API ──────────────────────────────────────────────
const listarRecursos = async () => {
  const res = await fetch(`${API_URL}/recursos`, {
    credentials: "include"
  });
  if (!res.ok) {
    throw new Error("Error al listar recursos");
  }
  return res.json();
};

const listarSalas = async () => {
  const res = await fetch(`${API_URL}/salas`, {
    credentials: "include" // 🔥 CLAVE
  });
  if (!res.ok) {
    throw new Error("Error al listar salas");
  }
  return res.json();
};

const listarRecursosPorSala = async (idSala) => {
  const res = await fetch(`${API_URL}/sala-recursos/sala/${idSala}`, {
    credentials: "include" // 🔥 CLAVE
  });
  if (!res.ok) {
    throw new Error("Error al listar recursos de la sala");
  }
  return res.json();
};

const agregarRecursoASala = async (data) => {
  const res = await fetch(`${API_URL}/sala-recursos`, {
    method: "POST",
    credentials: "include", // 🔥 CLAVE
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const respuesta = await res.json();

  if (!res.ok) {
    throw new Error(respuesta.error || "Error al agregar recurso a la sala");
  }

  return respuesta;
};

// ── Componente ────────────────────────────────────────────────────
function AgregarRecurso() {
  const [form, setForm] = useState({
    codigo: "",
    tipo: "",
    descripcion: "",
  });

  const [recursosSala, setRecursosSala] = useState([]);
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      const data = await listarSalas();
      setSalas(data); // 🔥 YA VIENEN FILTRADAS POR FACULTAD
    } catch (err) {
      mostrarMensaje(err.message, "error");
    }
  };

  const fetchRecursosSala = async (idSala) => {
    try {
      const data = await listarRecursosPorSala(idSala);
      setRecursosSala(data);
    } catch (err) {
      setRecursosSala([]);
      mostrarMensaje(err.message, "error");
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const seleccionarSala = async (sala) => {
    setSalaSeleccionada(sala);
    setForm({
      codigo: "",
      tipo: "",
      descripcion: "",
    });
    await fetchRecursosSala(sala.id);
  };

  const handleAgregar = async () => {
    if (!salaSeleccionada) {
      mostrarMensaje("Selecciona una sala.", "error");
      return;
    }

    if (!form.codigo || !form.tipo || !form.descripcion) {
      mostrarMensaje("Completa todos los campos del recurso.", "error");
      return;
    }

    setCargando(true);

    try {
      await agregarRecursoASala({
        id_sala: salaSeleccionada.id,
        codigo: form.codigo,
        tipo: form.tipo,
        descripcion: form.descripcion,
      });

      await fetchRecursosSala(salaSeleccionada.id);

      mostrarMensaje("Recurso agregado a la sala exitosamente.", "exito");

      setForm({
        codigo: "",
        tipo: "",
        descripcion: "",
      });
    } catch (err) {
      mostrarMensaje(err.message, "error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container">
      <NavbarGestionSalas />

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="content">
        {/* IZQUIERDA */}
        <div className="formSection">
          <h1>
            {salaSeleccionada
              ? `Recursos ${salaSeleccionada.id}`
              : "Selecciona una sala"}
          </h1>

          {!salaSeleccionada ? (
            <div className="listaRecursos">
              <p className="sinRecursos">
                Elige la sala a la que quieres agregar un recurso.
              </p>
            </div>
          ) : (
            <div className="listaRecursos">
              {recursosSala.length === 0 ? (
                <p className="sinRecursos">
                  Esta sala no tiene recursos asignados todavía.
                </p>
              ) : (
                recursosSala.map((r, index) => (
                  <div key={`${r.id_recurso}-${index}`} className="recursoItem">
                    <span className="recursoNombre">{r.tipo}</span>
                    <span className="recursoDesc">
                      {r.descripcion} — Código: {r.codigo}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* DERECHA */}
        <div className="listSection">
          {!salaSeleccionada ? (
            <>
              <h2>Salas</h2>
              <div className="listaRecursos">
                {salas.length === 0 ? (
                  <p className="sinRecursos">No hay salas registradas.</p>
                ) : (
                  salas.map((sala) => (
                    <div
                      key={sala.id}
                      className="recursoItem"
                      onClick={() => seleccionarSala(sala)}
                    >
                      <span className="recursoNombre">{sala.id}</span>
                      <span className="recursoDesc">
                        Nombre: {sala.nombre}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Agregar recurso</h2>

              <div className="campo">
                <label>Código:</label>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  placeholder="Ej: REC-001"
                />
              </div>

              <div className="campo">
                <label>Tipo:</label>
                <input
                  type="text"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  placeholder="Ej: Proyector"
                />
              </div>

              <div className="campo">
                <label>Descripción:</label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Ej: Proyector Epson 4K"
                />
              </div>

              <button
                type="button"
                className="volverBtn"
                onClick={() => {
                  setSalaSeleccionada(null);
                  setRecursosSala([]);
                  setForm({
                    codigo: "",
                    tipo: "",
                    descripcion: "",
                  });
                }}
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>

      <FooterRojo>
        {salaSeleccionada && (
          <button
            className="AgregarBtn"
            onClick={handleAgregar}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Agregar"}
          </button>
        )}
      </FooterRojo>
    </div>
  );
}

export default AgregarRecurso;
