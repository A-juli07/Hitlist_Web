# Hitlist Anime

Sistema completo de avaliação e discussão de animes.

## Funcionalidades

### Para Usuários
- Autenticação completa (registro/login)
- Sistema de avaliação com estrelas (1-5)
- Fórum de discussão com threads aninhadas (estilo Reddit)
- Sistema de likes em comentários
- Busca e filtros por categoria/gênero
- Interface totalmente responsiva
- Carrossel infinito de animes

### Para Administradores
- Adicionar novos animes
- Editar informações de animes
- Deletar animes
- Moderação de comentários

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticação
- Bcrypt para hash de senhas

### Frontend
- React 18 + Vite
- React Router DOM
- Axios
- React Icons
- CSS Modules

## Instalação

### Pré-requisitos
- Node.js 18+
- MongoDB

### Passo 1: Configurar o Backend
```bash
cd server
npm install

# Criar arquivo .env baseado no .env.example
cp .env.example .env
# Edite o .env e configure suas variáveis de ambiente
```

### Passo 2: Popular o Banco de Dados (Opcional)
Para adicionar dados de exemplo ao banco:
```bash
cd server
node src/seedData.js
```

Isso irá criar:
- Animes de exemplo (Attack on Titan, Your Name, One Punch Man, Demon Slayer, etc.)
- Usuário admin (email: `admin@anime.com`, senha: `admin123`)
- Usuário comum (email: `user@anime.com`, senha: `user123`)

### Passo 3: Iniciar o Backend
```bash
cd server
npm run dev
```

### Passo 4: Configurar e Iniciar o Frontend
```bash
cd client
npm install
npm run dev
```

## 🌐 URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 👤 Credenciais de Teste
Após popular o banco de dados, você pode usar:
- **Admin**: admin@anime.com / admin123
- **Usuário**: user@anime.com / user123

## 👥 Desenvolvedores

- [@A-juli07](https://github.com/A-juli07) - Backend & Arquitetura
- [@Wanderson-Morais](https://github.com/Wanderson-Morais) - Frontend & UX

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.
