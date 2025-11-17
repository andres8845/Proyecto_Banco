import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          🏦 Banco Digital
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/accounts" className="nav-link">
            Cuentas
          </Link>
          <Link to="/transactions" className="nav-link">
            Transacciones
          </Link>
          <Link to="/transfer" className="nav-link">
            Transferir
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.nombre} {user?.apellido}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
