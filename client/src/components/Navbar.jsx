import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiPlusCircle } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Anime Hitlist" className="navbar-logo" />
          <div className="navbar-text">
            <span className="brand-anime">ANIME</span>
            <span className="brand-hitlist">HITLIST</span>
          </div>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <FiHome /> Início
          </Link>

          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin/animes/new" className="nav-link">
                  <FiPlusCircle /> Adicionar Anime
                </Link>
              )}
              <Link to="/profile" className="nav-link">
                <FiUser /> {user.username}
              </Link>
              <button onClick={handleLogout} className="nav-link btn-logout">
                <FiLogOut /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
