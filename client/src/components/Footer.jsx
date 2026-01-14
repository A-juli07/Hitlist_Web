import { Link } from 'react-router-dom';
import { FiGithub, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <img src="/logo.png" alt="Anime Hitlist" className="footer-logo" />
            <div className="footer-text">
              <span className="brand-anime">ANIME</span>
              <span className="brand-hitlist">HITLIST</span>
            </div>
          </div>
          <p className="footer-description">
            Descubra, avalie e compartilhe seus animes favoritos com a comunidade
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Links Rápidos</h4>
          <nav className="footer-links">
            <Link to="/" className="footer-link">Início</Link>
            <Link to="/category/Ação" className="footer-link">Categorias</Link>
          </nav>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Redes Sociais</h4>
          <div className="footer-social">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="GitHub"
            >
              <FiGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            {currentYear} Anime Hitlist. Feito com <FiHeart className="heart-icon" /> por fãs de anime
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
