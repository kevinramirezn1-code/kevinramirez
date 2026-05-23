import '../styles/InicioDocente.css';
import gestionarReserva from '../assets/images/calendario.png';
import agregar from '../assets/images/agregar.png';
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import { Link } from 'react-router-dom';
import notificacion from '../assets/images/notificacion.png';
import { useState, useEffect } from 'react';
import { getNotificaciones }
from '../services/api';
import { useAuth }
from '../context/AuthContext';

function InicioDocente() {

  const [mostrarNotificaciones,
  setMostrarNotificaciones] = useState(false);

  const [notificaciones,
  setNotificaciones] = useState([]);

  const { user } = useAuth();

  const toggleNotificaciones = () => {
    setMostrarNotificaciones(!mostrarNotificaciones);
  };

  useEffect(() => {

    if (user?.id) {
      cargarNotificaciones();
    }

  }, [user]);

  const marcarComoLeida = (id) => {

  // Obtener leídas actuales
  const leidas =
    JSON.parse(
      localStorage.getItem(
        `notificaciones_leidas_${user.id}`
      )
    ) || [];

  // Guardar nueva
  localStorage.setItem(
    `notificaciones_leidas_${user.id}`,
    JSON.stringify([...leidas, id])
  );

  // Quitarla visualmente
  setNotificaciones(prev =>
    prev.filter(n => n.id !== id)
  );

};

  const cargarNotificaciones = async () => {

  try {

    const data =
      await getNotificaciones(user.id);

    // Obtener IDs leídas guardadas
    const leidas =
      JSON.parse(
        localStorage.getItem(
          `notificaciones_leidas_${user.id}`
        )
      ) || [];

    // Filtrar las leídas
    const filtradas =
      data.filter(
        n => !leidas.includes(n.id)
      );

    setNotificaciones(filtradas);

  } catch (error) {

    console.error(
      'Error cargando notificaciones',
      error
    );

  }

};

  return (

    <div className="docenteContainer">

      <NavbarGestionSalas />

      <div className="contenedorNotificacion">

        <img
          src={notificacion}
          alt="Notificación"
          className="notificacionIcon"
          onClick={toggleNotificaciones}
        />

        {
          notificaciones.length > 0 && (

            <span className="badgeNotificacion">

              {notificaciones.length}

            </span>

          )
        }

      </div>

      {mostrarNotificaciones && (
        <div className="notificacionesPanel">

          <div className="notificacionesHeader">
            <h3>Notificaciones</h3>
          </div>

          {
            notificaciones.length === 0
            ? (
              <div className="sinNotificaciones">
                <p>No tienes notificaciones.</p>
              </div>
            )
            : (
              notificaciones.map(n => (

                <div
                  key={n.id}
                  className={
                    n.accion === 'CANCELACION'
                    ? 'notificacionCard cancelada'
                    : 'notificacionCard ajuste'
                  }
                >

                  <div className="notificacionTop">

                    <span className="tipoNotificacion">

                      {
                        n.accion === 'CANCELACION'
                        ? '❌ Cancelación'
                        : '✏️ Ajuste'
                      }

                    </span>

                  </div>

                  <p className="mensajeNotificacion">

                    {
                      n.accion === 'CANCELACION'
                      ? `Tu reserva #${n.id_reserva} fue cancelada`
                      : `Tu reserva #${n.id_reserva} fue ajustada`
                    }

                  </p>

                  {
                    n.accion === 'AJUSTE' && (
                      <div className="detalleNotificacion">

                        <small>
                          <strong>Sala anterior:</strong>{" "}
                          {n.salaAnterior?.nombre || 'N/A'}
                        </small>

                        <small>
                          <strong>Nueva sala:</strong>{" "}
                          {n.salaNueva?.nombre || 'N/A'}
                        </small>

                      </div>
                    )
                  }

                  {
                    n.accion === 'CANCELACION' && (

                      <small className="estadoCancelada">
                        Estado: CANCELADA
                      </small>

                    )
                  }

                  <div className="fechasNotificacion">

                    <small>
                      <strong>Fecha anterior:</strong><br />

                      {
                        n.fechaInicio_antes
                        ?
                        new Date(
                          n.fechaInicio_antes
                        ).toLocaleString()
                        :
                        'N/A'
                      }
                    </small>

                    <small>
                      <strong>Nueva fecha:</strong><br />

                      {
                        n.fechaInicio_despues
                        ?
                        new Date(
                          n.fechaInicio_despues
                        ).toLocaleString()
                        :
                        'N/A'
                      }
                    </small>

                  </div>

                  <button
                    className="btnLeida"
                    onClick={() =>
                      marcarComoLeida(n.id)
                    }
                  >
                    Marcar como leída
                  </button>

                </div>

              ))
            )
          }

        </div>

      )}

      <div className="mainContent">

        <div className="welcomeSection">

          <h1 className="titulo">
            Bienvenido(a)
          </h1>

          <p className="subtitulo">
            Al portal de gestión de salas y reservas
          </p>

          <div className="linea"></div>

        </div>

        <div className="gestionarReservasContainer">

          <div className="gestionar">

            <p className="reservaTitle">
              Gestionar reservas
            </p>

            <Link to="/inicio/GestionarReservas">

              <img
                src={gestionarReserva}
                alt="Gestionar reserva"
                className="gestionarImage"
              />

            </Link>

          </div>

          <div className="agregarButton">

            <img
              src={agregar}
              alt="Agregar"
              className="agregarIcon"
            />

          </div>

        </div>

      </div>

    </div>

  );

}

export default InicioDocente;