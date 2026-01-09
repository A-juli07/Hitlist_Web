import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Avaliação é obrigatória'],
    min: [1, 'Avaliação mínima é 1'],
    max: [5, 'Avaliação máxima é 5']
  }
}, {
  timestamps: true
});

ratingSchema.index({ user: 1, anime: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
