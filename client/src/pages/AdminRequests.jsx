import { useState, useEffect } from 'react';
import { animeRequestService } from '../services/api';
import Loading from '../components/Loading';
import { FiAlertCircle, FiCheck, FiX, FiTrash2, FiClock } from 'react-icons/fi';
import './AdminRequests.css';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const { data } = await animeRequestService.getAll(params);
      setRequests(data);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      showMessage('Erro ao carregar solicitações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await animeRequestService.updateStatus(id, status);
      showMessage(`Solicitação ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'marcada como adicionada'}!`, 'success');
      fetchRequests();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      showMessage('Erro ao atualizar solicitação', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta solicitação?')) return;

    try {
      await animeRequestService.delete(id);
      showMessage('Solicitação deletada com sucesso!', 'success');
      fetchRequests();
    } catch (error) {
      console.error('Erro ao deletar solicitação:', error);
      showMessage('Erro ao deletar solicitação', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 4000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: 'Pendente', icon: <FiClock />, class: 'status-pending' },
      approved: { label: 'Aprovado', icon: <FiCheck />, class: 'status-approved' },
      rejected: { label: 'Rejeitado', icon: <FiX />, class: 'status-rejected' },
      added: { label: 'Adicionado', icon: <FiCheck />, class: 'status-added' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredStats = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    added: requests.filter(r => r.status === 'added').length
  };

  if (loading) return <Loading />;

  return (
    <div className="admin-requests">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <FiAlertCircle /> Solicitações de Anime
          </h1>
          <p className="page-subtitle">
            Gerencie as solicitações de anime enviadas pelos usuários
          </p>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas <span className="badge">{filteredStats.all}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendentes <span className="badge badge-warning">{filteredStats.pending}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Aprovadas <span className="badge badge-success">{filteredStats.approved}</span>
          </button>
          <button
            className={`filter-tab ${filter === 'added' ? 'active' : ''}`}
            onClick={() => setFilter('added')}
          >
            Adicionadas <span className="badge badge-info">{filteredStats.added}</span>
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="empty-state">
            <FiAlertCircle className="empty-icon" />
            <h2>Nenhuma solicitação encontrada</h2>
            <p>Não há solicitações {filter !== 'all' ? `com status "${filter}"` : 'no momento'}.</p>
          </div>
        ) : (
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3 className="anime-name">{request.animeName}</h3>
                  {getStatusBadge(request.status)}
                </div>

                <div className="request-info">
                  <div className="info-row">
                    <span className="info-label">Solicitado por:</span>
                    <span className="info-value">
                      {request.userName || request.requestedBy?.username || 'Anônimo'}
                    </span>
                  </div>
                  {request.userEmail && (
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{request.userEmail}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-label">Data:</span>
                    <span className="info-value">{formatDate(request.createdAt)}</span>
                  </div>
                </div>

                <div className="request-actions">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'approved')}
                        className="btn btn-success btn-sm"
                        title="Aprovar"
                      >
                        <FiCheck /> Aprovar
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'rejected')}
                        className="btn btn-danger btn-sm"
                        title="Rejeitar"
                      >
                        <FiX /> Rejeitar
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(request._id, 'added')}
                      className="btn btn-info btn-sm"
                      title="Marcar como adicionado"
                    >
                      <FiCheck /> Marcar como Adicionado
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="btn btn-outline btn-sm"
                    title="Deletar"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequests;
