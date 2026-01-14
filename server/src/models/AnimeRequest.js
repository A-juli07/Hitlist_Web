import mongoose from 'mongoose';

const animeRequestSchema = new mongoose.Schema({
  animeName: {
    type: String,
    required: true,
    trim: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userEmail: {
    type: String,
    trim: true
  },
  userName: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'added'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

const AnimeRequest = mongoose.model('AnimeRequest', animeRequestSchema);

export default AnimeRequest;
