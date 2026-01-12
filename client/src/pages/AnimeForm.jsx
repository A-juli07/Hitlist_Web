import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animeService } from '../services/api';
import './AnimeForm.css';

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

const AnimeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Ação',
    genres: '',
    episodes: 0,
    status: 'Em Lançamento',
    releaseYear: new Date().getFullYear(),
    studio: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    if (id) {
      fetchAnime();
    }
  }, [id, isAdmin]);

  const fetchAnime = async () => {
    try {
      const { data } = await animeService.getById(id);
      setFormData({
        ...data,
        genres: data.genres?.join(', ') || ''
      });
    } catch (error) {
      console.error('Erro ao buscar anime:', error);
      setError('Erro ao carregar anime');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()).filter(Boolean),
        episodes: parseInt(formData.episodes) || 0,
        releaseYear: parseInt(formData.releaseYear)
      };

      if (id) {
        await animeService.update(id, data);
      } else {
        await animeService.create(data);
      }

      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar anime:', error);
      setError(error.response?.data?.message || 'Erro ao salvar anime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anime-form-page">
      <div className="container">
        <div className="form-header">
          <h1>{id ? 'Editar Anime' : 'Adicionar Novo Anime'}</h1>
          <p>Preencha os campos abaixo para {id ? 'atualizar' : 'adicionar'} o anime</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="anime-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">URL da Imagem *</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
              required
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="releaseYear">Ano de Lançamento *</label>
              <input
                type="number"
                id="releaseYear"
                name="releaseYear"
                value={formData.releaseYear}
                onChange={handleChange}
                min="1960"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="episodes">Episódios</label>
              <input
                type="number"
                id="episodes"
                name="episodes"
                value={formData.episodes}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Em Lançamento">Em Lançamento</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Em Breve">Em Breve</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studio">Estúdio</label>
              <input
                type="text"
                id="studio"
                name="studio"
                value={formData.studio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genres">Gêneros (separados por vírgula)</label>
              <input
                type="text"
                id="genres"
                name="genres"
                value={formData.genres}
                onChange={handleChange}
                placeholder="Ação, Aventura, Comédia"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : id ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimeForm;
