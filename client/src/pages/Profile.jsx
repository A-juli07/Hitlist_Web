import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiSave } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      username: user.username || '',
      email: user.email || '',
      avatar: user.avatar || ''
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      setMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao atualizar perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={user.avatar} alt={user.username} />
            </div>
            <h1>{user.username}</h1>
            <p className="profile-role">
              {user.role === 'admin' ? 'Administrador' : 'Usuário'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <h2>Informações do Perfil</h2>

            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">
                <FiUser /> Nome de Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                className="input-disabled"
              />
              <small>O nome de usuário não pode ser alterado</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="input-disabled"
              />
              <small>O email não pode ser alterado</small>
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <h3>Membro desde</h3>
                <p>{new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="stat-card">
                <h3>Status</h3>
                <p className="status-active">Ativo</p>
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn btn-danger"
              >
                Sair da Conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
