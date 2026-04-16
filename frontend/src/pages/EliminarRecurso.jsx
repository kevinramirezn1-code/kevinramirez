import { useState, useEffect } from "react";
import NavbarGestionSalas from "../components/NavbarGestionSalas";
import FooterRojo from "../components/FooterRojo";
import { getRecursosPorSala, eliminarRecursoDeSala } from "../services/api";
import "../styles/EliminarRecurso.css";

function EliminarRecurso() {
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(null);
  const [recursosSala, setRecursosSala] = useState([]);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    obtenerSalas();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3000);
  };

  // 🔥 CORREGIDO: ahora envía sesión
  const obtenerSalas = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/salas", {
        credentials: "include" // 🔥 CLAVE
      });

      const data = await res.json();
      setSalas(data); // 🔥 ya vienen filtradas por facultad
    } catch (error) {
      mostrarMensaje("Error al obtener salas", "error");
    }
  };

  const fetchRecursosSala = async (idSala) => {
    try {
      const data = await getRecursosPorSala(idSala);
      setRecursosSala(data);
    } catch (err) {
      setRecursosSala([]);
      mostrarMensaje(err.message, "error");
    }
  };

  const seleccionarSala = async (sala) => {
    setSalaSeleccionada(sala);
    setRecursoSeleccionado(null);
    await fetchRecursosSala(sala.id);
  };

  const handleEliminar = async () => {
    if (!salaSeleccionada) {
      mostrarMensaje("Selecciona primero una sala.", "error");
      return;
    }

    if (!recursoSeleccionado) {
      mostrarMensaje("Selecciona un recurso activo en la sala.", "error");
      return;
    }

    setCargando(true);
    try {
      await eliminarRecursoDeSala({
        id_sala: salaSeleccionada.id,
        id_recurso: recursoSeleccionado.id_recurso
      });

      mostrarMensaje("Recurso inactivado correctamente.", "exito");
      setRecursoSeleccionado(null);
      await fetchRecursosSala(salaSeleccionada.id);

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
        <div className="formSection">
          <h1>Eliminar recurso de sala</h1>

          {!salaSeleccionada ? (
            <div className="listaRecursos">
              <p className="sinRecursos">
                Selecciona la sala de la que deseas eliminar un recurso.
              </p>
            </div>
          ) : (
            <>
              <h2>Sala seleccionada: {salaSeleccionada.nombre}</h2>

              <div className="listaRecursos">
                {recursosSala.length === 0 ? (
                  <p className="sinRecursos">
                    Esta sala no tiene recursos activos.
                  </p>
                ) : (
                  recursosSala.map((recurso) => (
                    <div
                      key={`${recurso.id_recurso}-${recurso.codigo}`}
                      className={`recursoItem ${
                        recursoSeleccionado?.id_recurso === recurso.id_recurso
                          ? "activo"
                          : ""
                      }`}
                      onClick={() => setRecursoSeleccionado(recurso)}
                    >
                      <div>
                        <strong>{recurso.tipo}</strong> — {recurso.descripcion}
                      </div>
                      <div>Código: {recurso.codigo}</div>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                className="volverSalasBtn"
                onClick={() => {
                  setSalaSeleccionada(null);
                  setRecursosSala([]);
                  setRecursoSeleccionado(null);
                }}
              >
                Volver a salas
              </button>
            </>
          )}
        </div>

        <div className="listSection">
          {!salaSeleccionada ? (
            <>
              <h2>Salas disponibles</h2>
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
                      <span className="recursoNombre">
                        {sala.id}
                      </span>
                      <span className="recursoDesc">
                        {sala.nombre}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <h2>Recursos activos</h2>
              <p>Haz click en el recurso que quieras inactivar.</p>
            </>
          )}
        </div>
      </div>

      <FooterRojo>
        <button
          className="EliminarBtn"
          onClick={handleEliminar}
          disabled={!salaSeleccionada || !recursoSeleccionado || cargando}
        >
          {cargando ? "Procesando..." : "Eliminar"}
        </button>
      </FooterRojo>
    </div>
  );
}

export default EliminarRecurso;