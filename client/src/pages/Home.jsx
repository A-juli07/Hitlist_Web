import { useState, useEffect } from 'react';
import { animeService, animeRequestService } from '../services/api';
import AnimeCarousel from '../components/AnimeCarousel';
import Loading from '../components/Loading';
import { FiSearch, FiAlertCircle, FiSend } from 'react-icons/fi';
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
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

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
      setSearchPerformed(false);
      return;
    }

    try {
      const { data } = await animeService.getAll({ search: searchTerm });
      setSearchResults(data);
      setSearchPerformed(true);
      setRequestMessage('');
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setSearchResults([]);
      setSearchPerformed(true);
    }
  };

  const handleRequestAnime = async () => {
    if (!searchTerm.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await animeRequestService.create(
        searchTerm,
        user.email || '',
        user.username || ''
      );
      setRequestMessage('Solicitação enviada com sucesso! O administrador será notificado.');
      setTimeout(() => setRequestMessage(''), 5000);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setRequestMessage('Erro ao enviar solicitação. Tente novamente mais tarde.');
      setTimeout(() => setRequestMessage(''), 5000);
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
        {searchPerformed && searchResults.length === 0 && (
          <section className="section not-found-section">
            <div className="not-found-card">
              <FiAlertCircle className="not-found-icon" />
              <h2 className="not-found-title">Anime não encontrado</h2>
              <p className="not-found-text">
                Não encontramos nenhum anime com o termo "{searchTerm}".
              </p>
              <p className="not-found-suggestion">
                Que tal solicitar ao administrador para adicionar este anime?
              </p>
              <button onClick={handleRequestAnime} className="btn btn-primary request-btn">
                <FiSend /> Solicitar anime ao administrador
              </button>
              {requestMessage && (
                <div className={`request-message ${requestMessage.includes('sucesso') ? 'success' : 'error'}`}>
                  {requestMessage}
                </div>
              )}
            </div>
          </section>
        )}

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
