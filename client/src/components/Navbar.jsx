import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiHome, FiPlusCircle, FiGrid, FiChevronDown, FiBell } from 'react-icons/fi';
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
                <>
                  <Link to="/admin/animes/new" className="nav-link">
                    <FiPlusCircle /> Adicionar Anime
                  </Link>
                  <Link to="/admin/requests" className="nav-link notification-link">
                    <FiBell /> Solicitações
                    {pendingRequestsCount > 0 && (
                      <span className="notification-badge">{pendingRequestsCount}</span>
                    )}
                  </Link>
                </>
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
