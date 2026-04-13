import { useEffect, useState } from "react";
import NavbarGestionSalas from "../components/NavbarGestionSalas";
import "../styles/EditarEstado.css";
import axios from "axios";
import FooterRojo from "../components/FooterRojo";

function EditarEstado() {
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [estado, setEstado] = useState("");

  // 🔥 FUNCIÓN PARA TRAER SALAS
  const obtenerSalas = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/salas");
      setSalas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 CARGAR AL INICIO
  useEffect(() => {
    obtenerSalas();
  }, []);

  // 🔹 Seleccionar sala
  const seleccionarSala = (sala) => {
    setSalaSeleccionada(sala);
    setEstado(sala.estado);
  };

  // 🔹 Actualizar estado
  const actualizarEstado = async () => {
    if (!salaSeleccionada) return alert("Selecciona una sala");

    try {
      await axios.put(
        `http://localhost:3001/api/salas/${salaSeleccionada.id}`,
        { estado: estado.toLowerCase() }
      );

      alert("Estado actualizado ✅");

      // 🔥 refrescar lista
      await obtenerSalas();

      // limpiar selección
      setSalaSeleccionada(null);
      setEstado("");

    } catch (error) {
      console.error(error);
      alert("Error al actualizar ❌");
    }
  };

  return (
    <div className="container">
      <NavbarGestionSalas />

      <div className="content">

        {/* IZQUIERDA */}
        <div className="formSection">
          <h2>{salaSeleccionada?.id || ""}</h2>

          <div className="formGroup">
            <label>Estado:</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <button className="actualizarBtn" onClick={actualizarEstado}>
            Actualizar
          </button>
        </div>

        {/* DERECHA */}
        <div className="listSection">

          {salas.length === 0 ? (
            <div className="emptyState">
              <p>No hay salas creadas</p>
            </div>
          ) : (
            salas.map((sala) => (
              <div
                key={sala.id}
                className={`salaItem ${salaSeleccionada?.id === sala.id ? "active" : ""}`}
                onClick={() => seleccionarSala(sala)}
              >
                <p><strong>{sala.id}</strong></p>
                <p>{sala.nombre}</p>
                <span className={`estado ${sala.estado}`}>
                  {sala.estado}
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

export default EditarEstado;