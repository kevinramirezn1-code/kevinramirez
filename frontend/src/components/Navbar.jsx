import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logoUao from "../assets/images/logoUao.png";

function Navbar() {
  return (
    <nav className="navbar">
       <div className="navbarlogoInicio">
        <Link to="/"><img src={logoUao} alt="logoUao" className="logoInicio" /></Link>

      </div>

      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
      </div>

    </nav>
  );
}

export default Navbar;