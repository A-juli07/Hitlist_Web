import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { animeService } from '../services/api';
import AnimeCard from '../components/AnimeCard';
import Loading from '../components/Loading';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimesByCategory();
  }, [category]);

  const fetchAnimesByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await animeService.getByCategory(category);
      setAnimes(data);
    } catch (error) {
      console.error('Erro ao buscar animes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-header">
          <h1 className="category-title">{category}</h1>
          <p className="category-count">
            {animes.length} {animes.length === 1 ? 'anime encontrado' : 'animes encontrados'}
          </p>
        </div>

        {animes.length > 0 ? (
          <div className="anime-grid">
            {animes.map((anime) => (
              <AnimeCard key={anime._id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>Nenhum anime encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
