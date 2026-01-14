import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Rotas públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rotas administrativas
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);
router.patch('/:id/toggle', protect, admin, toggleCategoryStatus);

export default router;
