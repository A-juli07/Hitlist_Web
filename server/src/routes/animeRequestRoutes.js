import express from 'express';
import {
  createAnimeRequest,
  getAnimeRequests,
  updateAnimeRequestStatus,
  deleteAnimeRequest
} from '../controllers/animeRequestController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Rota pública para criar solicitação (não requer autenticação)
router.post('/', createAnimeRequest);

// Rotas administrativas (requerem autenticação e privilégios de admin)
router.get('/', protect, admin, getAnimeRequests);
router.put('/:id', protect, admin, updateAnimeRequestStatus);
router.delete('/:id', protect, admin, deleteAnimeRequest);

export default router;
