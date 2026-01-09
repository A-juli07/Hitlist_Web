import Rating from '../models/Rating.js';
import Anime from '../models/Anime.js';

// @desc    Criar ou atualizar rating
// @route   POST /api/ratings
// @access  Private
export const createOrUpdateRating = async (req, res) => {
  try {
    const { animeId, rating } = req.body;

    // Verificar se anime existe
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime não encontrado' });
    }

    // Verificar se usuário já avaliou este anime
    let existingRating = await Rating.findOne({
      user: req.user._id,
      anime: animeId
    });

    if (existingRating) {
      // Atualizar rating existente
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      // Criar novo rating
      existingRating = await Rating.create({
        user: req.user._id,
        anime: animeId,
        rating
      });
    }

    // Recalcular média de avaliações do anime
    await updateAnimeRating(animeId);

    res.status(201).json(existingRating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao avaliar anime', error: error.message });
  }
};

// @desc    Buscar rating do usuário para um anime
// @route   GET /api/ratings/anime/:animeId
// @access  Private
export const getUserRating = async (req, res) => {
  try {
    const rating = await Rating.findOne({
      user: req.user._id,
      anime: req.params.animeId
    });

    res.json(rating || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliação', error: error.message });
  }
};

// @desc    Buscar todas as avaliações de um anime
// @route   GET /api/ratings/anime/:animeId/all
// @access  Public
export const getAnimeRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ anime: req.params.animeId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
  }
};

// @desc    Deletar rating
// @route   DELETE /api/ratings/:id
// @access  Private
export const deleteRating = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);

    if (!rating) {
      return res.status(404).json({ message: 'Avaliação não encontrada' });
    }

    // Verificar se o usuário é o dono da avaliação
    if (rating.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Não autorizado' });
    }

    const animeId = rating.anime;
    await rating.deleteOne();

    // Recalcular média de avaliações
    await updateAnimeRating(animeId);

    res.json({ message: 'Avaliação removida com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar avaliação', error: error.message });
  }
};

// Função auxiliar para atualizar a média de avaliações do anime
const updateAnimeRating = async (animeId) => {
  const ratings = await Rating.find({ anime: animeId });

  if (ratings.length > 0) {
    const totalRating = ratings.reduce((acc, item) => acc + item.rating, 0);
    const averageRating = totalRating / ratings.length;

    await Anime.findByIdAndUpdate(animeId, {
      averageRating: Math.round(averageRating * 10) / 10, // Arredondar para 1 casa decimal
      totalRatings: ratings.length
    });
  } else {
    await Anime.findByIdAndUpdate(animeId, {
      averageRating: 0,
      totalRatings: 0
    });
  }
};
