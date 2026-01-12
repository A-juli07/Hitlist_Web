import { useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './AnimeCarousel.css';

const AnimeCarousel = ({ title, animes, categoryLink, icon, subtitle }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.querySelector('.carousel-item');
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 20; // gap entre os cards
        const scrollAmount = cardWidth + gap;
        const container = carouselRef.current;
        const maxScroll = container.scrollWidth - container.offsetWidth;

        let newScrollLeft;

        if (direction === 'right') {
          // Se está no final, volta para o início
          if (container.scrollLeft >= maxScroll - 10) {
            newScrollLeft = 0;
          } else {
            newScrollLeft = container.scrollLeft + scrollAmount;
          }
        } else {
          // Se está no início, vai para o final
          if (container.scrollLeft <= 10) {
            newScrollLeft = maxScroll;
          } else {
            newScrollLeft = container.scrollLeft - scrollAmount;
          }
        }

        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  if (!animes || animes.length === 0) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <div className="carousel-title-container">
          {icon && <span className="carousel-icon">{icon}</span>}
          <h2 className="carousel-title">{title}</h2>
          {subtitle && <p className="carousel-subtitle">{subtitle}</p>}
        </div>
        {categoryLink && (
          <Link to={categoryLink} className="view-all-link">
            Ver todos →
          </Link>
        )}
      </div>

      <div className="carousel-wrapper">
        <button
          className="carousel-btn carousel-btn-left"
          onClick={() => scroll('left')}
          aria-label="Anterior"
        >
          <FiChevronLeft />
        </button>

        <div className="carousel-container" ref={carouselRef}>
          {animes.map((anime) => (
            <div key={anime._id} className="carousel-item">
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>

        <button
          className="carousel-btn carousel-btn-right"
          onClick={() => scroll('right')}
          aria-label="Próximo"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AnimeCarousel;
