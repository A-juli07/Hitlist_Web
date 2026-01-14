import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da categoria é obrigatório'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Category', categorySchema);
