import mongoose from 'mongoose';

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  image: {
    type: String,
    required: [true, 'Imagem é obrigatória']
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['Ação', 'Romance', 'Comédia', 'Drama', 'Fantasia', 'Ficção Científica', 'Terror', 'Slice of Life', 'Esporte', 'Aventura']
  },
  genres: [{
    type: String
  }],
  releaseYear: {
    type: Number,
    required: [true, 'Ano de lançamento é obrigatório']
  },
  episodes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Em Lançamento', 'Finalizado', 'Em Breve'],
    default: 'Em Lançamento'
  },
  studio: String,
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Anime', animeSchema);
