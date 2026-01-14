import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from '../models/Category.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const categories = [
  {
    name: 'Ação',
    description: 'Animes repletos de lutas, batalhas e aventuras emocionantes',
    active: true
  },
  {
    name: 'Romance',
    description: 'Histórias de amor e relacionamentos',
    active: true
  },
  {
    name: 'Comédia',
    description: 'Animes engraçados e divertidos',
    active: true
  },
  {
    name: 'Drama',
    description: 'Narrativas emocionantes e profundas',
    active: true
  },
  {
    name: 'Fantasia',
    description: 'Mundos mágicos e criaturas fantásticas',
    active: true
  },
  {
    name: 'Ficção Científica',
    description: 'Tecnologia avançada e exploração espacial',
    active: true
  },
  {
    name: 'Terror',
    description: 'Animes de suspense e horror',
    active: true
  },
  {
    name: 'Slice of Life',
    description: 'Histórias do cotidiano e da vida real',
    active: true
  },
  {
    name: 'Esporte',
    description: 'Competições esportivas e superação',
    active: true
  },
  {
    name: 'Aventura',
    description: 'Jornadas épicas e explorações',
    active: true
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Conectado ao MongoDB');

    // Limpar categorias existentes (opcional)
    await Category.deleteMany({});
    console.log('🗑️  Categorias antigas removidas');

    // Inserir novas categorias
    await Category.insertMany(categories);
    console.log('✅ Categorias inseridas com sucesso!');

    console.log('\nCategorias criadas:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular categorias:', error);
    process.exit(1);
  }
};

seedCategories();
