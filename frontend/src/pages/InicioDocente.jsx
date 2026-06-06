import '../styles/InicioDocente.css'; 
import gestionarReserva from '../assets/images/calendario.png';
import agregar from '../assets/images/agregar.png';
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import { Link } from 'react-router-dom'; // 👈 ESTA LÍNEA FALTABA

function InicioDocente() {
  return (
    <div className="docenteContainer">
      <NavbarGestionSalas  />
      
      <div className="mainContent">
        <div className="welcomeSection">
          <h1 className="titulo">Bienvenido(a)</h1>
          <p className="subtitulo">Al portal de gestión de salas y reservas</p>
          <div className="linea"></div>
        </div>

        <div className="gestionarReservasContainer">
          <div className="gestionar">
            <p className="reservaTitle">Gestionar reservas</p>
            <Link to="/inicio/GestionarReservas">
              <img src={gestionarReserva} alt="Gestionar reserva" className="gestionarImage" />
            </Link>
          </div>

          <div className="agregarButton">
            <img src={agregar} alt="Agregar" className="agregarIcon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InicioDocente;