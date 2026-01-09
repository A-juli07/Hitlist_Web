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
    enum: ['Ação', 'Aventura', 'Comédia', 'Drama', 'Fantasia', 'Romance', 'Suspense', 'Ficção Científica']
  },
  genres: [{
    type: String,
    required: true
  }],
  releaseYear: {
    type: Number,
    required: [true, 'Ano de lançamento é obrigatório']
  },
  episodes: {
    type: Number,
    required: [true, 'Número de episódios é obrigatório']
  },
  status: {
    type: String,
    enum: ['Em andamento', 'Concluído', 'Cancelado'],
    default: 'Em andamento'
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
