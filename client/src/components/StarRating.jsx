import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange, readOnly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            {!readOnly && (
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => onRatingChange(ratingValue)}
                style={{ display: 'none' }}
              />
            )}
            <FaStar
              className={`star ${ratingValue <= (hover || rating) ? 'filled' : ''}`}
              color={
                ratingValue <= (hover || rating)
                  ? 'var(--orange-primary)'
                  : 'var(--text-muted)'
              }
              size={size}
              onMouseEnter={() => !readOnly && setHover(ratingValue)}
              onMouseLeave={() => !readOnly && setHover(0)}
              style={{ cursor: readOnly ? 'default' : 'pointer' }}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
