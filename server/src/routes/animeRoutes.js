import express from 'express';
import {
  getAnimes,
  getAnimeById,
  getAnimesByCategory,
  getTopRatedAnimes,
  createAnime,
  updateAnime,
  deleteAnime
} from '../controllers/animeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnimes);
router.get('/top/rated', getTopRatedAnimes);
router.get('/category/:category', getAnimesByCategory);
router.get('/:id', getAnimeById);
router.post('/', protect, admin, createAnime);
router.put('/:id', protect, admin, updateAnime);
router.delete('/:id', protect, admin, deleteAnime);

export default router;
