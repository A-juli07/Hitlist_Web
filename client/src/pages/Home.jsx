import { useState, useEffect } from 'react';
import { animeService } from '../services/api';
import AnimeCarousel from '../components/AnimeCarousel';
import Loading from '../components/Loading';
import { FiSearch } from 'react-icons/fi';
import './Home.css';

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

const Home = () => {
  const [animesByCategory, setAnimesByCategory] = useState({});
  const [topAnimes, setTopAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchAllCategories();
    fetchTopAnimes();
  }, []);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const promises = categories.map(category => animeService.getByCategory(category));
      const results = await Promise.all(promises);

      const categorizedAnimes = {};
      categories.forEach((category, index) => {
        categorizedAnimes[category] = results[index].data;
      });

      setAnimesByCategory(categorizedAnimes);
    } catch (error) {
      console.error('Erro ao buscar animes por categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopAnimes = async () => {
    try {
      const { data } = await animeService.getTopRated();
      setTopAnimes(data);
    } catch (error) {
      console.error('Erro ao buscar top animes:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data } = await animeService.getAll({ search: searchTerm });
      setSearchResults(data);
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setSearchResults([]);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Descubra e Avalie seus <span>Animes Favoritos</span>
          </h1>
          <p className="hero-subtitle">
            Explore uma vasta coleção de animes e compartilhe suas opiniões com a comunidade
          </p>
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-icon" />
            <input type="text" placeholder="Buscar animes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      </section>

      <div className="container">
        {searchResults.length > 0 && (
          <section className="section">
            <AnimeCarousel title="Resultados da Busca" animes={searchResults} />
          </section>
        )}

        {loading ? <Loading /> : (
          <>
            {topAnimes.length > 0 && (
              <section className="section">
                <AnimeCarousel title="Top Animes"  animes={topAnimes} />
              </section>
            )}

            {categories.map((category) => {
              const animes = animesByCategory[category];
              if (!animes || animes.length === 0) return null;

              return (
                <section key={category} className="section">
                  <AnimeCarousel title={category} animes={animes} categoryLink={`/category/${category}`} />
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
