import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { FiStar, FiUsers } from 'react-icons/fi';
import './AnimeCard.css';

const AnimeCard = ({ anime }) => {
  return (
    <Link to={`/anime/${anime._id}`} className="anime-card">
      <div className="anime-card-image">
        <img src={anime.image} alt={anime.title} />
      </div>

      <div className="anime-card-content">
        <h3 className="anime-card-title">{anime.title}</h3>

        <p className="anime-card-description">
          {anime.description.length > 100
            ? `${anime.description.substring(0, 100)}...`
            : anime.description}
        </p>

        <div className="anime-card-footer">
          <div className="anime-rating">
            <FiStar className="rating-icon" />
            <span>{anime.averageRating.toFixed(1)}</span>
          </div>

          <div className="anime-stats">
            <FiUsers className="stats-icon" />
            <span>{anime.totalRatings} avaliações</span>
          </div>
        </div>

        <div className="anime-year">
          {anime.releaseYear} • {anime.status}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
