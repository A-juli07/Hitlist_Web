import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar se o usuário está autenticado
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pegar token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário pelo ID do token (sem a senha)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

// Middleware para verificar se o usuário é admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }
};

// Gerar token JWT
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
