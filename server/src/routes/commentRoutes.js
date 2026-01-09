import express from 'express';
import {
  getAnimeComments,
  createComment,
  deleteComment,
  toggleLikeComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/anime/:animeId', getAnimeComments);
router.post('/', protect, createComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleLikeComment);

export default router;
