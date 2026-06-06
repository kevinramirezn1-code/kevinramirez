import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 🔥 contexto

import '../styles/NavbarGestionSalas.css'; 
import logo from '../assets/images/logoUaoRojo.png';
import avatar from '../assets/images/avatar.png';
import facultad from '../assets/images/facultad.png';

function NavbarGestionSalas() {

  const { user, logout } = useAuth(); // 🔥 usuario y logout
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 🔥 LOGOUT REAL
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 🔹 Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbarGestion">
      <div className="navbarLogoGestion">
          <img src={logo} alt="logo" className="logoGestion" />
      </div>

      <div className="navbarRightGestion">

        {/* 🔥 ROL DINÁMICO */}
        <span className="userRole">
          {user?.rol ? user.rol.toUpperCase() : "INVITADO"}
        </span>

        <div className="avatarContainer" ref={dropdownRef}>
          <img 
            src={avatar} 
            alt="avatar" 
            className="avatarGestion" 
            onClick={toggleDropdown}
          />
          
          {isDropdownOpen && (
            <div className="dropdownMenu">
              <div className="dropdownContent">

                {/* 🔹 Usuario */}
                <div className="userInfoSection">
                  <img src={avatar} alt="avatar" className="dropdownAvatar" />
                  <div className="userEmailSection">
                    <span className="emailValue">
                      {user?.correo || "Sin correo"}
                    </span>
                  </div>
                </div>
                
                {/* 🔹 Facultad */}
                <div className="dropdownFacultad">
                  <img src={facultad} alt="facultad" className="facultadIcon" />
                  <span className="facultadText">
                    {user?.facultad_nombre || "Sin facultad"}
                  </span>
                </div>
                
                {/* 🔹 Logout */}
                <button className="logoutButton" onClick={handleLogout}>
                  Cerrar sesión
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}

export default NavbarGestionSalas;