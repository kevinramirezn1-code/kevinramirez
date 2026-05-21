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

  const cargarNotificaciones = async () => {

    try {

      const data =
        await getNotificaciones(user.id);

      setNotificaciones(data);

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

          <h3>Notificaciones</h3>

          {
            notificaciones.length === 0
            ? (
              <p>No tienes notificaciones.</p>
            )
            : (
              notificaciones.map(n => (

                <div
                  key={n.id}
                  className={
                    n.accion === 'CANCELACION'
                    ? 'notificacionCancelada'
                    : 'notificacionItem'
                  }
                >

                  <p>

                    {
                      n.accion === 'CANCELACION'
                      ? `Tu reserva #${n.id_reserva} fue cancelada`
                      : `Tu reserva #${n.id_reserva} fue ajustada`
                    }

                  </p>

                  {
                    n.accion === 'AJUSTE' && (
                      <>

                        <small>

                          Sala anterior:
                          {
                            n.salaAnterior?.nombre || 'N/A'
                          }

                        </small>

                        <br />

                        <small>

                          Nueva sala:
                          {
                            n.salaNueva?.nombre || 'N/A'
                          }

                        </small>

                        <br />

                      </>
                    )
                  }

                  {
                    n.accion === 'CANCELACION' && (

                      <>
                      
                        <small
                          style={{
                            color: 'red',
                            fontWeight: 'bold'
                          }}
                        >
                          Estado: CANCELADA
                        </small>

                        <br />

                      </>

                    )
                  }

                  <small>

                    Fecha anterior:
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

                  <br />

                  <small>

                    Nueva fecha:
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

                  <hr />

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