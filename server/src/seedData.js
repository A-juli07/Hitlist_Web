// Script para popular o banco de dados com dados de exemplo
// Execute com: node src/seedData.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Anime from './models/Anime.js';

dotenv.config();

const animeData = [
  {
    title: 'Attack on Titan',
    description: 'A humanidade vive atrás de enormes muralhas para se proteger de criaturas gigantes conhecidas como Titãs. Quando um Titã Colossal rompe a muralha externa, o jovem Eren Yeager jura vingar-se e exterminar todos os Titãs.',
    image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',
    category: ['Ação', 'Drama'],
    genres: ['Ação', 'Drama', 'Fantasia', 'Horror'],
    episodes: 87,
    status: 'Finalizado',
    releaseYear: 2013,
    studio: 'MAPPA, Wit Studio'
  },
  {
    title: 'Your Name',
    description: 'Dois adolescentes que nunca se conheceram começam a trocar de corpos misteriosamente. À medida que desvendam o mistério, descobrem um vínculo profundo que transcende tempo e espaço.',
    image: 'https://cdn.myanimelist.net/images/anime/5/87048l.jpg',
    category: ['Romance', 'Drama'],
    genres: ['Romance', 'Drama', 'Fantasia'],
    episodes: 1,
    status: 'Finalizado',
    releaseYear: 2016,
    studio: 'CoMix Wave Films'
  },
  {
    title: 'One Punch Man',
    description: 'Saitama é um herói que pode derrotar qualquer oponente com apenas um soco. Mas sua vida é tediosa porque ele é forte demais.',
    image: 'https://cdn.myanimelist.net/images/anime/12/76049l.jpg',
    category: ['Ação', 'Comédia'],
    genres: ['Ação', 'Comédia', 'Superherói'],
    episodes: 24,
    status: 'Em Lançamento',
    releaseYear: 2015,
    studio: 'Madhouse'
  },
  {
    title: 'Demon Slayer',
    description: 'Tanjiro Kamado se torna um caçador de demônios após sua família ser massacrada e sua irmã transformada em um demônio.',
    image: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',
    category: ['Ação', 'Aventura'],
    genres: ['Ação', 'Aventura', 'Sobrenatural'],
    episodes: 63,
    status: 'Em Lançamento',
    releaseYear: 2019,
    studio: 'Ufotable'
  },
  {
    title: 'Death Note',
    description: 'Light Yagami encontra um caderno sobrenatural que permite matar qualquer pessoa cujo nome seja escrito nele.',
    image: 'https://cdn.myanimelist.net/images/anime/9/9453l.jpg',
    category: ['Drama'],
    genres: ['Drama', 'Suspense', 'Sobrenatural'],
    episodes: 37,
    status: 'Finalizado',
    releaseYear: 2006,
    studio: 'Madhouse'
  },
  {
    title: 'Spy x Family',
    description: 'Um espião, uma assassina e uma telepata formam uma família falsa para cumprir suas missões secretas.',
    image: 'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
    category: ['Comédia', 'Ação'],
    genres: ['Comédia', 'Ação', 'Slice of Life'],
    episodes: 25,
    status: 'Em Lançamento',
    releaseYear: 2022,
    studio: 'Wit Studio, CloverWorks'
  },
  {
    title: 'Steins;Gate',
    description: 'Um grupo de estudantes descobre como enviar mensagens para o passado, mas logo percebem que suas ações têm consequências devastadoras.',
    image: 'https://cdn.myanimelist.net/images/anime/5/73199l.jpg',
    category: ['Ficção Científica', 'Drama'],
    genres: ['Ficção Científica', 'Suspense', 'Drama'],
    episodes: 24,
    status: 'Finalizado',
    releaseYear: 2011,
    studio: 'White Fox'
  },
  {
    title: 'My Hero Academia',
    description: 'Em um mundo onde 80% da população possui superpoderes, Izuku Midoriya nasce sem habilidades.',
    image: 'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',
    category: ['Ação', 'Aventura'],
    genres: ['Ação', 'Superherói', 'Aventura'],
    episodes: 138,
    status: 'Em Lançamento',
    releaseYear: 2016,
    studio: 'Bones'
  },
  {
    title: 'Violet Evergarden',
    description: 'Após a guerra, Violet Evergarden busca entender o significado das últimas palavras de seu comandante.',
    image: 'https://cdn.myanimelist.net/images/anime/1795/95088l.jpg',
    category: ['Drama', 'Romance'],
    genres: ['Drama', 'Romance', 'Slice of Life'],
    episodes: 13,
    status: 'Finalizado',
    releaseYear: 2018,
    studio: 'Kyoto Animation'
  },
  {
    title: 'Haikyuu!!',
    description: 'Hinata Shoyo, um jogador de vôlei baixinho, mas determinado, entra para o time de sua escola.',
    image: 'https://cdn.myanimelist.net/images/anime/7/76014l.jpg',
    category: ['Esporte', 'Comédia'],
    genres: ['Esporte', 'Comédia', 'Drama'],
    episodes: 85,
    status: 'Finalizado',
    releaseYear: 2014,
    studio: 'Production I.G'
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'Yuji Itadori entra no mundo das maldições após engolir um objeto amaldiçoado.',
    image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
    category: ['Ação', 'Terror'],
    genres: ['Ação', 'Sobrenatural', 'Horror'],
    episodes: 47,
    status: 'Em Lançamento',
    releaseYear: 2020,
    studio: 'MAPPA'
  },
  {
    title: 'A Silent Voice',
    description: 'Shoya Ishida busca redenção após intimidar uma colega surda no ensino fundamental.',
    image: 'https://cdn.myanimelist.net/images/anime/1122/96435l.jpg',
    category: ['Drama', 'Romance'],
    genres: ['Drama', 'Romance', 'Slice of Life'],
    episodes: 1,
    status: 'Finalizado',
    releaseYear: 2016,
    studio: 'Kyoto Animation'
  },
  {
    title: 'Naruto',
    description: 'Naruto Uzumaki é um jovem ninja rejeitado por sua vila por carregar dentro de si a Raposa de Nove Caudas. Seu sonho é se tornar Hokage e ser reconhecido por todos.',
    image: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg',
    category: ['Ação', 'Aventura'],
    genres: ['Ação', 'Aventura', 'Shounen'],
    episodes: 220,
    status: 'Finalizado',
    releaseYear: 2002,
    studio: 'Studio Pierrot'
  },
  {
    title: 'Naruto Shippuden',
    description: 'Após anos de treinamento, Naruto retorna mais forte para enfrentar organizações perigosas e salvar seu amigo Sasuke da escuridão.',
    image: 'https://cdn.myanimelist.net/images/anime/5/17407l.jpg',
    category: ['Ação', 'Aventura', 'Drama'],
    genres: ['Ação', 'Aventura', 'Drama'],
    episodes: 500,
    status: 'Finalizado',
    releaseYear: 2007,
    studio: 'Studio Pierrot'
  },
  {
    title: 'Dragon Ball Z',
    description: 'Goku protege a Terra contra guerreiros poderosos enquanto descobre suas origens como um Saiyajin.',
    image: 'https://cdn.myanimelist.net/images/anime/1607/117271l.jpg',
    category: ['Ação', 'Aventura'],
    genres: ['Ação', 'Aventura', 'Artes Marciais'],
    episodes: 291,
    status: 'Finalizado',
    releaseYear: 1989,
    studio: 'Toei Animation'
  },
  {
    title: 'Dragon Ball Super',
    description: 'Goku enfrenta deuses da destruição e guerreiros de múltiplos universos em batalhas que definem o destino do multiverso.',
    image: 'https://cdn.myanimelist.net/images/anime/7/74606l.jpg',
    category: ['Ação', 'Aventura', 'Fantasia'],
    genres: ['Ação', 'Aventura', 'Fantasia'],
    episodes: 131,
    status: 'Finalizado',
    releaseYear: 2015,
    studio: 'Toei Animation'
  },
  {
    title: 'Bleach',
    description: 'Ichigo Kurosaki ganha poderes de Ceifeiro de Almas e passa a proteger humanos de espíritos malignos.',
    image: 'https://cdn.myanimelist.net/images/anime/3/40451l.jpg',
    category: ['Ação', 'Aventura'],
    genres: ['Ação', 'Sobrenatural', 'Shounen'],
    episodes: 366,
    status: 'Finalizado',
    releaseYear: 2004,
    studio: 'Studio Pierrot'
  },
  {
    title: 'Fullmetal Alchemist: Brotherhood',
    description: 'Dois irmãos alquimistas buscam a Pedra Filosofal para recuperar seus corpos após uma tentativa fracassada de alquimia proibida.',
    image: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',
    category: ['Aventura', 'Drama', 'Fantasia'],
    genres: ['Aventura', 'Drama', 'Fantasia'],
    episodes: 64,
    status: 'Finalizado',
    releaseYear: 2009,
    studio: 'Bones'
  },
  {
    title: 'Hunter x Hunter',
    description: 'Gon Freecss parte em uma jornada para se tornar um Hunter e encontrar seu pai, enfrentando desafios mortais pelo caminho.',
    image: 'https://cdn.myanimelist.net/images/anime/1337/99013l.jpg',
    category: ['Aventura', 'Ação', 'Fantasia'],
    genres: ['Aventura', 'Ação', 'Fantasia'],
    episodes: 148,
    status: 'Finalizado',
    releaseYear: 2011,
    studio: 'Madhouse'
  },
  {
    title: 'Tokyo Ghoul',
    description: 'Ken Kaneki se torna meio-ghoul após um acidente e precisa sobreviver em um mundo onde humanos e ghouls estão em constante conflito.',
    image: 'https://cdn.myanimelist.net/images/anime/5/64449l.jpg',
    category: ['Terror', 'Drama'],
    genres: ['Horror', 'Drama', 'Sobrenatural'],
    episodes: 48,
    status: 'Finalizado',
    releaseYear: 2014,
    studio: 'Studio Pierrot'
  },
  {
    title: 'Chainsaw Man',
    description: 'Denji se funde com seu demônio de estimação e passa a trabalhar como caçador de demônios em troca de uma vida minimamente digna.',
    image: 'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
    category: ['Ação', 'Terror'],
    genres: ['Ação', 'Horror', 'Sobrenatural'],
    episodes: 12,
    status: 'Em Lançamento',
    releaseYear: 2022,
    studio: 'MAPPA'
  },
  {
    title: 'Blue Lock',
    description: 'Um projeto radical reúne atacantes do Japão para criar o maior artilheiro do mundo, colocando ego e ambição acima de tudo.',
    image: 'https://cdn.myanimelist.net/images/anime/1258/126929l.jpg',
    category: ['Esporte', 'Drama'],
    genres: ['Esporte', 'Drama', 'Psicológico'],
    episodes: 24,
    status: 'Em Lançamento',
    releaseYear: 2022,
    studio: 'Eight Bit'
  }
];


const seedDatabase = async () => {
  try {
    // Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar dados existentes
    await Anime.deleteMany({});
    console.log('🗑️  Animes anteriores removidos');

    // Buscar ou criar usuário admin
    let adminUser = await User.findOne({ email: 'admin@anime.com' });

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@anime.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('👤 Usuário admin criado (email: admin@anime.com, senha: admin123)');
    }

    // Criar animes com o admin como criador
    const animesWithCreator = animeData.map(anime => ({
      ...anime,
      createdBy: adminUser._id
    }));

    const createdAnimes = await Anime.insertMany(animesWithCreator);
    console.log(`✨ ${createdAnimes.length} animes criados com sucesso!`);

    console.log('\n📊 Resumo:');
    console.log('- Categorias: Ação, Romance, Comédia, Drama, etc.');
    console.log('- Total de animes: ' + createdAnimes.length);
    console.log('\n🚀 Banco de dados populado com sucesso!');
    console.log('\n👉 Acesse http://localhost:3000 para ver os animes');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    process.exit(1);
  }
};

seedDatabase();
