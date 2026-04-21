import { useState, useEffect } from "react";
import NavbarGestionSalas from "../components/NavbarGestionSalas";
import "../styles/GestionarSalas.css";
import { eliminarRecursoDeSala } from "../services/api";
import devolver from '../assets/images/devolver.png';
import { Link } from "react-router-dom";

function GestionarSalas({ user }) {
  const [salas, setSalas] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [selectedSala, setSelectedSala] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState("info");

  const [editForm, setEditForm] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: ""
  });

  const [showRecursosModal, setShowRecursosModal] = useState(false);
  const [recursosSala, setRecursosSala] = useState([]);

  const [nuevoRecurso, setNuevoRecurso] = useState({
    codigo: "",
    tipo: "",
    descripcion: ""
  });

  const [editEstado, setEditEstado] = useState("");

  const [sala, setSala] = useState({
    id: "",
    nombre: "",
    ubicacion: "",
    capacidad: ""
  });

  const obtenerSalas = async () => {
    const res = await fetch("http://localhost:3001/api/salas", {
      credentials: "include"
    });
    const data = await res.json();
    setSalas(data);
  };

  useEffect(() => {
    obtenerSalas();
  }, []);

  const crearSala = async () => {
    if (!sala.id || !sala.nombre || !sala.ubicacion || !sala.capacidad) {
      return alert("Campos obligatorios");
    }

    await fetch("http://localhost:3001/api/salas", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...sala,
        capacidad: Number(sala.capacidad),
        estado: "disponible"
      })
    });

    setShowModal(false);
    obtenerSalas();
  };

  const editarInfo = async () => {
    await fetch(
      `http://localhost:3001/api/salas/${selectedSala.id}/datos`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          capacidad: Number(editForm.capacidad)
        })
      }
    );

    alert("Actualizado ✅");
    obtenerSalas();
  };

  const editarEstado = async () => {
    await fetch(
      `http://localhost:3001/api/salas/${selectedSala.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estado: editEstado.toLowerCase()
        })
      }
    );

    alert("Estado actualizado ✅");
    obtenerSalas();
  };

  const obtenerRecursosSala = async (idSala) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/sala-recursos/sala/${idSala}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setRecursosSala(data);
    } catch (err) {
      console.error(err);
    }
  };

  const agregarRecurso = async () => {
    if (!nuevoRecurso.codigo || !nuevoRecurso.tipo || !nuevoRecurso.descripcion) {
      return alert("Completa todos los campos");
    }

    await fetch("http://localhost:3001/api/sala-recursos", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_sala: selectedSala.id,
        ...nuevoRecurso
      })
    });

    setNuevoRecurso({ codigo: "", tipo: "", descripcion: "" });
    obtenerRecursosSala(selectedSala.id);
  };

  const eliminarRecurso = async (id_recurso) => {
    const confirmar = window.confirm("¿Eliminar este recurso?");
    if (!confirmar) return;

    try {
      await eliminarRecursoDeSala({
        id_sala: selectedSala.id,
        id_recurso: id_recurso
      });

      // 🔥 ACTUALIZA EL ESTADO SIN RECARGAR
      setRecursosSala(prev =>
        prev.filter(r => r.id_recurso !== id_recurso)
      );

    } catch (err) {
      console.error(err);
      alert(err.message || "Error al eliminar recurso");
    }
  };

  return (
    <div className="container">
      <NavbarGestionSalas userRole={user?.rol || ""} />

      <div className="header">
        <h2>Gestión de Salas</h2>
        <button className="btn-crear" onClick={() => setShowModal(true)}>
          + Crear Sala
        </button>
      </div>

      {/* GRID */}
      <div className="grid-salas">
        {salas.map((s) => (
          <div key={s.id} className="card">
            <div className="card-content">
              <h3>{s.nombre}</h3>
              <p>{s.ubicacion}</p>

              <div className="card-info">
                <span>👥 {s.capacidad}</span>
                <span className={`estado ${s.estado}`}>
                  {s.estado}
                </span>
              </div>
            </div>

            <div className="overlay">
              <button
                onClick={() => {
                  setSelectedSala(s);
                  setShowInfoModal(true);
                }}
              >
                Ver Info
              </button>

              <button
                onClick={() => {
                  setSelectedSala(s);
                  setShowRecursosModal(true);
                  obtenerRecursosSala(s.id);
                }}
              >
                Recursos
              </button>

              <button
                className="editar"
                onClick={() => {
                  setSelectedSala(s);
                  setShowEditModal(true);
                  setEditForm({
                    nombre: s.nombre,
                    ubicacion: s.ubicacion,
                    capacidad: s.capacidad
                  });
                  setEditEstado(s.estado);
                }}
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL CREAR */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Crear Sala</h3>

            <input placeholder="ID" onChange={e => setSala({...sala,id:e.target.value})}/>
            <input placeholder="Nombre" onChange={e => setSala({...sala,nombre:e.target.value})}/>
            <input placeholder="Ubicación" onChange={e => setSala({...sala,ubicacion:e.target.value})}/>
            <input type="number" placeholder="Capacidad" onChange={e => setSala({...sala,capacidad:e.target.value})}/>

            <div className="modal-buttons">
              <button className="cancelar" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="crear" onClick={crearSala}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INFO BONITO */}
      {showInfoModal && selectedSala && (
        <div className="modal-overlay">
          <div className="modal info-modal">

            <h3>Detalles de la Sala</h3>

            <div className="info-grid">
              <div><span>ID</span><strong>{selectedSala.id}</strong></div>
              <div><span>Nombre</span><strong>{selectedSala.nombre}</strong></div>
              <div><span>Ubicación</span><strong>{selectedSala.ubicacion}</strong></div>
              <div><span>Capacidad</span><strong>{selectedSala.capacidad}</strong></div>
              <div>
                <span>Estado</span>
                <strong className={`estado ${selectedSala.estado}`}>
                  {selectedSala.estado}
                </strong>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="cancelar" onClick={() => setShowInfoModal(false)}>
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {showEditModal && selectedSala && (
        <div className="modal-overlay">
          <div className="modal">

            <h3>Editar Sala</h3>

            <div className="tabs">
              <button
                className={editTab === "info" ? "active" : ""}
                onClick={() => setEditTab("info")}
              >Info</button>

              <button
                className={editTab === "estado" ? "active" : ""}
                onClick={() => setEditTab("estado")}
              >Estado</button>
            </div>

            {editTab === "info" && (
              <>
                <input value={editForm.nombre} onChange={e=>setEditForm({...editForm,nombre:e.target.value})}/>
                <input value={editForm.ubicacion} onChange={e=>setEditForm({...editForm,ubicacion:e.target.value})}/>
                <input type="number" value={editForm.capacidad} onChange={e=>setEditForm({...editForm,capacidad:e.target.value})}/>

                <button className="btn-guardar" onClick={editarInfo}>
                  Guardar Cambios
                </button>
              </>
            )}

            {editTab === "estado" && (
              <>
                <select value={editEstado} onChange={e=>setEditEstado(e.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>

                <button className="btn-estado" onClick={editarEstado}>
                  Actualizar Estado
                </button>
              </>
            )}

            <div className="modal-buttons">
              <button className="cancelar" onClick={()=>setShowEditModal(false)}>
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/*MODAL RECURSOS */}
      {showRecursosModal && selectedSala && (
        <div className="modal-overlay">
          <div className="modal recursos-modal">

            <h3>Recursos - {selectedSala.nombre}</h3>

            <div className="recursos-container">

              {/* LISTA */}
              <div className="recursos-lista">
                <h4>Recursos actuales</h4>

                {recursosSala.length === 0 ? (
                  <p>No hay recursos</p>
                ) : (
                  recursosSala.map((r) => (
                    <div key={r.id_recurso} className="recurso-card">
                      <div>
                        <strong>{r.tipo}</strong>
                        <p>{r.descripcion}</p>
                        <span>{r.codigo}</span>
                      </div>

                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarRecurso(r.id_recurso)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* FORM */}
              <div className="recursos-form">
                <h4>Agregar recurso</h4>

                <input
                  placeholder="Código"
                  value={nuevoRecurso.codigo}
                  onChange={(e) =>
                    setNuevoRecurso({ ...nuevoRecurso, codigo: e.target.value })
                  }
                />

                <input
                  placeholder="Tipo"
                  value={nuevoRecurso.tipo}
                  onChange={(e) =>
                    setNuevoRecurso({ ...nuevoRecurso, tipo: e.target.value })
                  }
                />

                <input
                  placeholder="Descripción"
                  value={nuevoRecurso.descripcion}
                  onChange={(e) =>
                    setNuevoRecurso({
                      ...nuevoRecurso,
                      descripcion: e.target.value
                    })
                  }
                />

                <button className="btn-agregar" onClick={agregarRecurso}>
                  + Agregar
                </button>
              </div>

            </div>

            <div className="modal-buttons">
              <button
                className="cancelar"
                onClick={() => setShowRecursosModal(false)}
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="footergr">
        <Link to="/Secretaria">
          <img src={devolver} alt="devolver" className="devolvergr" />
        </Link>
      </div>
    </div>
  );
}

export default GestionarSalas;