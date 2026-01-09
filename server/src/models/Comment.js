import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'Conteúdo do comentário é obrigatório'],
    trim: true,
    minlength: [3, 'Comentário deve ter pelo menos 3 caracteres'],
    maxlength: [1000, 'Comentário deve ter no máximo 1000 caracteres']
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment'
});

export default mongoose.model('Comment', commentSchema);
