import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import '../styles/Login.css';
import avatar from '../assets/images/avatar.png';
import visible from '../assets/images/visible.png';
import privado from '../assets/images/privado.png';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(correo, contraseña);

    if (result.success) {
      if (result.user.rol === 'docente') navigate('/docente');
      else if (result.user.rol === 'secretaria') navigate('/secretaria');
      else navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="loginContainer">
      <Navbar />

      <div className="loginContent">
        <form onSubmit={handleSubmit} className="login">

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

          {error && <p className="error-message">{error}</p>}

          <button className="ingresar" type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Ingresar'}
          </button>

        </form>

        <p className="texto">Welcome Back</p>
      </div>
    </div>
  );
}

export default Login;