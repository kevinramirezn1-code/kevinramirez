import '../styles/InicioSecretaria.css'; 
import gestionarSalas from '../assets/images/salaReuniones.png';
import gestionarReserva from '../assets/images/calendario.png';
import agregar from '../assets/images/agregar.png';
import NavbarGestionSalas from '../components/NavbarGestionSalas';
import { Link } from "react-router-dom";

const InicioSecretaria = () => {
  return (
    <div className="secretariaContainer">
      <NavbarGestionSalas  />
      
      <div className="mainContent">
        <div className="welcomeSection">
          <h1 className="titulo">Bienvenido(a)</h1>
          <p className="subtitulo">Al portal de gestión de salas y reservas</p>
          <div className="linea"></div>
        </div>

        <div className="gestionarSalasContainer">
          <div className="gestionar">
            <p className="gestionarTitle">Gestionar salas</p>
            <Link to="/inicio/GestionarSala"> <img src={gestionarSalas} alt="Gestionar salas" className="gestionarImage" /></Link>
        </div>

          <div className="gestionar">
            <p className="gestionarTitle">Gestionar reservas</p>
            <Link to="/inicio/GestionarReservas"> <img src={gestionarReserva} alt="Gestionar reserva" className="gestionarImage" /></Link>
           </div>      

          <div className="agregarButton">
            <img src={agregar} alt="Agregar" className="agregarIcon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioSecretaria;