import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiPlusCircle, FiGrid, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

const categories = [
  'Ação',
  'Romance',
  'Comédia',
  'Drama',
  'Fantasia',
  'Ficção Científica',
  'Terror',
  'Slice of Life',
  'Esporte',
  'Aventura'
];

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);

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

          <div className="categories-dropdown">
            <button
              className="nav-link categories-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              <FiGrid /> Categorias <FiChevronDown className={`chevron ${showCategories ? 'open' : ''}`} />
            </button>

            {showCategories && (
              <>
                <div
                  className="dropdown-overlay"
                  onClick={() => setShowCategories(false)}
                />
                <div className="dropdown-menu">
                  {categories.map((category) => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      className="dropdown-item"
                      onClick={() => setShowCategories(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

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
