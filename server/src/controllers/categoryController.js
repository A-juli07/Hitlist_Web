import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const { active } = req.query;
    const query = active !== undefined ? { active: active === 'true' } : {};

    const categories = await Category.find(query).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Categoria não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar categoria', error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Nome da categoria é obrigatório' });
    }

    const category = await Category.create({ name: name.trim(), description });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Já existe uma categoria com este nome' });
    }
    res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    Object.assign(category, req.body);
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Já existe uma categoria com este nome' });
    }
    res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    await category.deleteOne();
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar categoria', error: error.message });
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    category.active = !category.active;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status', error: error.message });
  }
};
