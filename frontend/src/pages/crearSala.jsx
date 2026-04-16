import { useState, useEffect } from "react";
import NavbarGestionSalas from "../components/NavbarGestionSalas";
import "../styles/crearSala.css";
import FooterRojo from "../components/FooterRojo";

function CrearSala() {

  const [sala, setSala] = useState({
    id: "",
    nombre: "",
    ubicacion: "",
    capacidad: "",
    estado: "disponible"
  });

  const [salas, setSalas] = useState([]);

  // 🔥 OBTENER SALAS (ya filtradas por backend)
  const obtenerSalas = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/salas", {
        credentials: "include" // 🔥 IMPORTANTE (sesión)
      });
      const data = await response.json();
      setSalas(data);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 CARGAR SALAS
  useEffect(() => {
    obtenerSalas();
  }, []);

  // 🔥 CREAR SALA
  const crearSala = async () => {

    if (!sala.id || !sala.nombre || !sala.ubicacion || !sala.capacidad) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/salas", {
        method: "POST",
        credentials: "include", // 🔥 CLAVE PARA SESIÓN
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: sala.id,
          nombre: sala.nombre,
          ubicacion: sala.ubicacion,
          capacidad: Number(sala.capacidad),
          estado: sala.estado.toLowerCase()
          // ❌ SIN facultad_id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data));
        return;
      }

      alert("Sala creada correctamente ✅");

      await obtenerSalas();

      // 🔥 LIMPIAR FORMULARIO
      setSala({
        id: "",
        nombre: "",
        ubicacion: "",
        capacidad: "",
        estado: "disponible"
      });

    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div className="container">
      <NavbarGestionSalas />

      <div className="content">

        {/* IZQUIERDA */}
        <div className="formSection">

          <div className="formGroup">
            <label>Codigo Sala</label>
            <input
              type="text"
              value={sala.id}
              onChange={(e) => setSala({ ...sala, id: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label>Nombre:</label>
            <input
              type="text"
              value={sala.nombre}
              onChange={(e) => setSala({ ...sala, nombre: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label>Ubicación:</label>
            <input
              type="text"
              value={sala.ubicacion}
              onChange={(e) => setSala({ ...sala, ubicacion: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label>Capacidad:</label>
            <input
              type="number"
              value={sala.capacidad}
              onChange={(e) => setSala({ ...sala, capacidad: e.target.value })}
            />
          </div>

          <div className="formGroup">
            <label>Estado:</label>
            <select
              value={sala.estado}
              onChange={(e) => setSala({ ...sala, estado: e.target.value })}
            >
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          {/* ❌ ELIMINADO SELECT DE FACULTAD */}

          <button className="crearBtn" onClick={crearSala}>
            Crear
          </button>
        </div>

        {/* DERECHA */}
        <div className="listSection">

          {salas.length === 0 ? (
            <div className="emptyState">
              <p>Aquí se mostrarán las salas creadas</p>
            </div>
          ) : (
            salas.map((s) => (
              <div key={s.id} className="formGroup salaCard">

                <div className="salaHeader">
                  <h3 className="salaTitulo">{s.nombre}</h3>
                </div>

                <div className="salaInfo">
                  <p><strong>ID:</strong> {s.id}</p>
                  <p><strong>Ubicación:</strong> {s.ubicacion}</p>
                  <p><strong>Capacidad:</strong> {s.capacidad}</p>
                  <p><strong>Facultad:</strong> {s.facultad_id}</p>
                </div>

                <span className={`estado ${s.estado}`}>
                  {s.estado}
                </span>

              </div>
            ))
          )}

        </div>

      </div>

      <FooterRojo />
    </div>
  );
}

export default CrearSala;