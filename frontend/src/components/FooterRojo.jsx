import { Link } from "react-router-dom";
import "../styles/FooterRojo.css";
import devolver from "../assets/images/devolver.png";

function FooterRojo({ children }) {
  return (
    <div className="footerRojo">
        {children}
        <Link to="/inicio/GSInicio">
            <img src={devolver} alt="devolver" className="devolverRojo" />
        </Link>
    </div>
  );
}

export default FooterRojo;