import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFacultades } from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/Signup.css";
import avatar from "../assets/images/avatar.png";
import visible from "../assets/images/visible.png";
import privado from "../assets/images/privado.png";

function Signup() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [idFacultad, setIdFacultad] = useState("");
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const data = await getFacultades();
        setFacultades(data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFacultades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo.trim().toLowerCase().endsWith("@uao.edu.co")) {
      setError("Solo se permiten correos institucionales (@uao.edu.co)");
      return;
    }

    try {
      await register(correo, contraseña, Number(idFacultad));
      navigate("/login");
    } catch (err) {
      const mensaje = err.response?.data?.message;
      setError(
        Array.isArray(mensaje)
          ? mensaje.join(", ")
          : mensaje || "Error de conexión con el servidor"
      );
    }
  };

  return (
    <div>
      <div className="signupContainer">
        <Navbar />

        <div className="signupContent">
          <form onSubmit={handleSubmit} className="signup">
            <img src={avatar} alt="avatar" className="avatar" />

            <input
              className="correo"
              placeholder="usuario@uao.edu.co"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <small style={{ color: "#666", fontSize: "12px", marginTop: "-10px" }}>
              Solo correos institucionales @uao.edu.co
            </small>

            <div className="passwordContainer">
              <input
                className="contraseña"
                placeholder="Contraseña"
                type={mostrarPassword ? "text" : "password"}
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
              <img
                src={mostrarPassword ? visible : privado}
                alt="toggle password"
                className="togglePassword"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              />
            </div>

            <select
              className="facultades"
              value={idFacultad}
              onChange={(e) => setIdFacultad(e.target.value)}
              required
            >
              <option value="">Selecciona una facultad</option>
              {facultades.map((fac) => (
                <option key={fac.idFacultad || fac.id} value={fac.idFacultad || fac.id}>
                  {fac.nombre}
                </option>
              ))}
            </select>

            {error && <p className="error-message">{error}</p>}

            <button className="ingresar" type="submit">
              Registrarse
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;