import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { categoryService } from '../services/api';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import './CategoryManagement.css';

const CategoryManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toasts, hideToast, success, error: showError } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [isAdmin, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      showError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Nome da categoria é obrigatório');
      return;
    }

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory._id, formData);
        success('Categoria atualizada com sucesso!');
      } else {
        await categoryService.create(formData);
        success('Categoria criada com sucesso!');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      const errorMessage = error.response?.data?.message || 'Erro ao salvar categoria';
      showError(errorMessage);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await categoryService.toggleStatus(id);
      success('Status da categoria atualizado!');
      fetchCategories();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      showError('Erro ao alterar status da categoria');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      await categoryService.delete(id);
      success('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      showError('Erro ao excluir categoria');
    }
  };

  if (loading) {
    return <div className="loading-container">Carregando...</div>;
  }

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

      <div className="category-management-page">
        <div className="container">
          <div className="page-header">
            <div>
              <h1>Gerenciar Categorias</h1>
              <p>Crie e gerencie as categorias de anime</p>
            </div>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <FiPlus /> Nova Categoria
            </button>
          </div>

          <div className="categories-grid">
            {categories.map(category => (
              <div key={category._id} className={`category-card ${!category.active ? 'inactive' : ''}`}>
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <span className={`status-badge ${category.active ? 'active' : 'inactive'}`}>
                    {category.active ? 'Ativa' : 'Inativa'}
                  </span>
                </div>

                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}

                <div className="category-actions">
                  <button
                    className="btn btn-icon"
                    onClick={() => handleOpenModal(category)}
                    title="Editar"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn btn-icon"
                    onClick={() => handleToggleStatus(category._id)}
                    title={category.active ? 'Desativar' : 'Ativar'}
                  >
                    {category.active ? <FiToggleRight /> : <FiToggleLeft />}
                  </button>
                  <button
                    className="btn btn-icon btn-danger"
                    onClick={() => handleDelete(category._id)}
                    title="Excluir"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="empty-state">
              <p>Nenhuma categoria cadastrada ainda.</p>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                <FiPlus /> Criar primeira categoria
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Nome da Categoria *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Ação, Romance, Comédia"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva esta categoria (opcional)"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryManagement;
