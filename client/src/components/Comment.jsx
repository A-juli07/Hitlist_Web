import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/api';
import { FiHeart, FiTrash2, FiMessageCircle, FiSend, FiMinus, FiPlus } from 'react-icons/fi';
import './Comment.css';

const Comment = ({ comment, animeId, onCommentUpdate, onCommentDelete, level = 0 }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLike = async () => {
    if (!user) {
      alert('Você precisa estar logado para curtir');
      navigate('/login');
      return;
    }

    try {
      const { data } = await commentService.toggleLike(comment._id);
      onCommentUpdate(data);
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Deseja realmente deletar este comentário e suas respostas?')) return;

    try {
      await commentService.delete(comment._id);
      onCommentDelete(comment._id);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      alert('Erro ao deletar comentário');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Você precisa estar logado para responder');
      navigate('/login');
      return;
    }

    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await commentService.create(animeId, replyContent, comment._id);

      // Atualizar comentário pai com a nova resposta
      onCommentUpdate({
        ...comment,
        replies: [...(comment.replies || []), data]
      });

      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Erro ao responder:', error);
      alert('Erro ao enviar resposta');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNestedUpdate = (updatedNestedComment) => {
    const updatedReplies = comment.replies.map(reply =>
      reply._id === updatedNestedComment._id ? updatedNestedComment : reply
    );
    onCommentUpdate({
      ...comment,
      replies: updatedReplies
    });
  };

  const handleNestedDelete = (deletedId) => {
    const updatedReplies = comment.replies.filter(reply => reply._id !== deletedId);
    onCommentUpdate({
      ...comment,
      replies: updatedReplies
    });
  };

  const maxNestingLevel = 5; // Limite de profundidade
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`comment ${level > 0 ? 'comment-reply' : ''} ${isCollapsed ? 'collapsed' : ''}`} style={{ marginLeft: `${level * 20}px` }}>
      <div className="comment-header">
        {/* Botão de colapsar/expandir */}
        <button
          className="btn-collapse"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expandir thread' : 'Colapsar thread'}
        >
          {isCollapsed ? <FiPlus /> : <FiMinus />}
        </button>

        <img
          src={comment.user.avatar || `https://ui-avatars.com/api/?name=${comment.user.username}&background=ff6b35&color=fff`}
          alt={comment.user.username}
          className="comment-avatar"
        />
        <div className="comment-meta">
          <span className="comment-author">{comment.user.username}</span>
          {!isCollapsed && (
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          )}
          {isCollapsed && hasReplies && (
            <span className="replies-count">
              {comment.replies.length} {comment.replies.length === 1 ? 'resposta' : 'respostas'}
            </span>
          )}
        </div>

        {!isCollapsed && (user?._id === comment.user._id || isAdmin) && (
          <button
            className="btn-delete"
            onClick={handleDelete}
            title="Deletar comentário"
          >
            <FiTrash2 />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <>
          <p className="comment-content">{comment.content}</p>

          <div className="comment-actions">
            <button
              className={`btn-like ${comment.likes?.includes(user?._id) ? 'liked' : ''}`}
              onClick={handleLike}
              title="Curtir"
            >
              <FiHeart /> {comment.likes?.length || 0}
            </button>

            {level < maxNestingLevel && (
              <button
                className="btn-reply"
                onClick={() => setShowReplyForm(!showReplyForm)}
                title="Responder"
              >
                <FiMessageCircle /> Responder
              </button>
            )}
          </div>

          {showReplyForm && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Responder a ${comment.user.username}...`}
                rows={3}
                required
              />
              <div className="reply-form-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <FiSend /> {submitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          )}

          {/* Renderizar respostas recursivamente */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="comment-replies">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  animeId={animeId}
                  onCommentUpdate={handleNestedUpdate}
                  onCommentDelete={handleNestedDelete}
                  level={level + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
