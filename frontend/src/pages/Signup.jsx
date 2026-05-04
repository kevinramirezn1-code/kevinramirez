import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFacultades } from '../services/api';
import Navbar from "../components/Navbar";
import "../styles/Signup.css";
import avatar from "../assets/images/avatar.png";
import visible from '../assets/images/visible.png';
import privado from '../assets/images/privado.png';

function Signup() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [idFacultad, setIdFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const data = await getFacultades();
        setFacultades(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFacultades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo,
          contraseña,
          idFacultad: Number(idFacultad)
        })
      });

      const data = await res.json();

      // 🔥 IGUAL QUE GESTIONAR SALAS
      if (!res.ok) {
        setError(
          data.error ||
          data.message?.join(", ") ||
          data.errores?.join(", ") ||
          "Error en registro"
        );
        return;
      }

      // ✅ SOLO SI TODO SALE BIEN
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
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
              placeholder="Correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />

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
                <option key={fac.id} value={fac.id}>
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