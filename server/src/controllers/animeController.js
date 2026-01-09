import Anime from '../models/Anime.js';

export const getAnimes = async (req, res) => {
  try {
    const { search, category, genre } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (genre) {
      query.genres = { $in: [genre] };
    }

    const animes = await Anime.find(query).sort({ createdAt: -1 });
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar animes', error: error.message });
  }
};

export const getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (anime) {
      res.json(anime);
    } else {
      res.status(404).json({ message: 'Anime não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar anime', error: error.message });
  }
};

export const getAnimesByCategory = async (req, res) => {
  try {
    const animes = await Anime.find({ category: req.params.category })
      .sort({ averageRating: -1 });
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar animes por categoria', error: error.message });
  }
};

export const getTopRatedAnimes = async (req, res) => {
  try {
    const animes = await Anime.find()
      .sort({ averageRating: -1 })
      .limit(10);
    res.json(animes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar top animes', error: error.message });
  }
};

export const createAnime = async (req, res) => {
  try {
    const anime = await Anime.create(req.body);
    res.status(201).json(anime);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar anime', error: error.message });
  }
};

export const updateAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (anime) {
      Object.assign(anime, req.body);
      const updatedAnime = await anime.save();
      res.json(updatedAnime);
    } else {
      res.status(404).json({ message: 'Anime não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar anime', error: error.message });
  }
};

export const deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);

    if (anime) {
      await anime.deleteOne();
      res.json({ message: 'Anime deletado com sucesso' });
    } else {
      res.status(404).json({ message: 'Anime não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar anime', error: error.message });
  }
};
