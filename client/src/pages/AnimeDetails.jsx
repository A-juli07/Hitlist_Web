import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { animeService, ratingService, commentService } from '../services/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import StarRating from '../components/StarRating';
import Loading from '../components/Loading';
import Comment from '../components/Comment';
import { FiCalendar, FiTv, FiEdit, FiTrash2, FiSend } from 'react-icons/fi';
import './AnimeDetails.css';

const AnimeDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toasts, hideToast, success, error: showError } = useToast();

  const [anime, setAnime] = useState(null);
  const [comments, setComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnimeDetails();
    fetchComments();
    if (user) {
      fetchUserRating();
    }
  }, [id, user]);

  const fetchAnimeDetails = async () => {
    try {
      const { data } = await animeService.getById(id);
      setAnime(data);
    } catch (error) {
      console.error('Erro ao buscar anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await commentService.getByAnime(id);
      setComments(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
    }
  };

  const fetchUserRating = async () => {
    try {
      const { data } = await ratingService.getUserRating(id);
      if (data) {
        setUserRating(data.rating);
      }
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);
    }
  };

  const handleRating = async (rating) => {
    if (!user) {
      alert('Você precisa estar logado para avaliar');
      navigate('/login');
      return;
    }

    try {
      await ratingService.create(id, rating);
      setUserRating(rating);
      fetchAnimeDetails(); // Atualizar média
    } catch (error) {
      console.error('Erro ao avaliar:', error);
      alert('Erro ao enviar avaliação');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Você precisa estar logado para comentar');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await commentService.create(id, newComment, null);
      setComments([data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Erro ao comentar:', error);
      alert('Erro ao enviar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentUpdate = (updatedComment) => {
    const updateCommentInList = (commentsList) => {
      return commentsList.map((c) => {
        if (c._id === updatedComment._id) {
          return updatedComment;
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: updateCommentInList(c.replies)
          };
        }
        return c;
      });
    };
    setComments(updateCommentInList(comments));
  };

  const handleCommentDelete = (commentId) => {
    const deleteCommentFromList = (commentsList) => {
      return commentsList.filter((c) => {
        if (c._id === commentId) return false;
        if (c.replies && c.replies.length > 0) {
          c.replies = deleteCommentFromList(c.replies);
        }
        return true;
      });
    };
    setComments(deleteCommentFromList(comments));
  };

  const handleDeleteAnime = async () => {
    if (!confirm('Deseja realmente deletar este anime?')) return;

    try {
      await animeService.delete(id);
      success('Anime deletado com sucesso!');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Erro ao deletar anime:', error);
      showError('Erro ao deletar anime');
    }
  };

  if (loading) return <Loading />;
  if (!anime) return <div>Anime não encontrado</div>;

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      <div className="anime-details">
      {/* Header com imagem de fundo */}
      <div className="anime-header" style={{ backgroundImage: `url(${anime.image})` }}>
        <div className="anime-header-overlay">
          <div className="container anime-header-content">
            <img src={anime.image} alt={anime.title} className="anime-poster" />

            <div className="anime-info">
              <h1 className="anime-title">{anime.title}</h1>

              <div className="anime-meta">
                <span className="badge badge-orange">{anime.category}</span>
                <span className="meta-item">
                  <FiCalendar /> {anime.releaseYear}
                </span>
                <span className="meta-item">
                  <FiTv /> {anime.episodes} episódios
                </span>
                <span className={`status-badge ${anime.status.toLowerCase().replace(' ', '-')}`}>
                  {anime.status}
                </span>
              </div>

              <div className="anime-rating-section">
                <div className="rating-display">
                  <span className="rating-number">{anime.averageRating.toFixed(1)}</span>
                  <StarRating rating={anime.averageRating} readOnly size={28} />
                  <span className="rating-count">({anime.totalRatings} avaliações)</span>
                </div>

                {user && (
                  <div className="user-rating">
                    <p>Sua avaliação:</p>
                    <StarRating rating={userRating} onRatingChange={handleRating} size={32} />
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="admin-actions">
                  <button className="btn btn-secondary" onClick={() => navigate(`/admin/animes/${id}/edit`)}>
                    <FiEdit /> Editar
                  </button>
                  <button className="btn btn-outline" onClick={handleDeleteAnime}>
                    <FiTrash2 /> Deletar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Descrição e detalhes */}
      <section className="section">
        <div className="container">
          <div className="anime-content">
            <div className="content-main">
              <h2>Sinopse</h2>
              <p className="anime-description">{anime.description}</p>

              {/* Comentários */}
              <div className="comments-section">
                <h2>Fórum ({comments.length})</h2>

                {user ? (
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Compartilhe sua opinião sobre este anime..."
                      rows={4}
                      required
                    />
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      <FiSend /> {submitting ? 'Enviando...' : 'Comentar'}
                    </button>
                  </form>
                ) : (
                  <p className="login-prompt">
                    <a href="/login">Entre</a> para comentar
                  </p>
                )}

                <div className="comments-list">
                  {comments.map((comment) => (
                    <Comment
                      key={comment._id}
                      comment={comment}
                      animeId={id}
                      onCommentUpdate={handleCommentUpdate}
                      onCommentDelete={handleCommentDelete}
                      level={0}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="content-sidebar">
              <div className="info-card">
                <h3>Informações</h3>
                <div className="info-item">
                  <span className="info-label">Estúdio:</span>
                  <span>{anime.studio || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gêneros:</span>
                  <div className="genres">
                    {anime.genres?.map((genre, index) => (
                      <span key={index} className="badge badge-blue">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span>{anime.status}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AnimeDetails;
