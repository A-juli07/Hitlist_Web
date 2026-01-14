import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiPlusCircle, FiGrid, FiChevronDown, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { animeRequestService } from '../services/api';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingRequests();
      // Atualizar contador a cada 30 segundos
      const interval = setInterval(fetchPendingRequests, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchPendingRequests = async () => {
    try {
      const { data } = await animeRequestService.getAll({ status: 'pending' });
      setPendingRequestsCount(data.length);
    } catch (error) {
      console.error('Erro ao buscar solicitações pendentes:', error);
    }
  };

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

        <button
          className="mobile-menu-toggle"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${showMobileMenu ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setShowMobileMenu(false)}>
            <FiHome /> <span>Início</span>
          </Link>

          <div className="categories-dropdown">
            <button
              className="nav-link categories-btn"
              onClick={() => setShowCategories(!showCategories)}
            >
              <FiGrid /> <span>Categorias</span> <FiChevronDown className={`chevron ${showCategories ? 'open' : ''}`} />
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
                      onClick={() => {
                        setShowCategories(false);
                        setShowMobileMenu(false);
                      }}
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
                <>
                  <Link to="/admin/animes/new" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                    <FiPlusCircle /> <span>Adicionar Anime</span>
                  </Link>
                  <Link to="/admin/requests" className="nav-link notification-link" onClick={() => setShowMobileMenu(false)}>
                    <FiBell /> <span>Solicitações</span>
                    {pendingRequestsCount > 0 && (
                      <span className="notification-badge">{pendingRequestsCount}</span>
                    )}
                  </Link>
                </>
              )}
              <Link to="/profile" className="nav-link" onClick={() => setShowMobileMenu(false)}>
                <FiUser /> <span>{user.username}</span>
              </Link>
              <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="nav-link btn-logout">
                <FiLogOut /> <span>Sair</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" onClick={() => setShowMobileMenu(false)}>
                Entrar
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setShowMobileMenu(false)}>
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
