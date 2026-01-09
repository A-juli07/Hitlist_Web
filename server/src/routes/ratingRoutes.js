import express from 'express';
import {
  createOrUpdateRating,
  getUserRating,
  getAnimeRatings,
  deleteRating
} from '../controllers/ratingController.js';
import { protect } from '../middleware/auth.js';
import { ratingValidation, validate } from '../middleware/validation.js';

const router = express.Router();

// Todas as rotas de rating requerem autenticação
router.post('/', protect, ratingValidation, validate, createOrUpdateRating);
router.get('/anime/:animeId', protect, getUserRating);
router.get('/anime/:animeId/all', getAnimeRatings);
router.delete('/:id', protect, deleteRating);

export default router;
