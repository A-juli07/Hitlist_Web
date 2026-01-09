import { body, validationResult } from 'express-validator';

// Middleware para verificar erros de validação
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validações para registro
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome de usuário deve ter pelo menos 3 caracteres')
    .isAlphanumeric()
    .withMessage('Nome de usuário deve conter apenas letras e números'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

// Validações para login
export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// Validações para anime
export const animeValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Título deve ter pelo menos 2 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10 })
    .withMessage('Descrição deve ter pelo menos 10 caracteres'),
  body('image')
    .trim()
    .notEmpty()
    .withMessage('URL da imagem é obrigatória')
    .isURL()
    .withMessage('URL da imagem inválida'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  body('releaseYear')
    .isInt({ min: 1960, max: new Date().getFullYear() + 1 })
    .withMessage('Ano de lançamento inválido')
];

// Validações para rating
export const ratingValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Avaliação deve ser entre 1 e 5 estrelas')
];

// Validações para comentário
export const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Conteúdo é obrigatório')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Comentário deve ter entre 3 e 1000 caracteres')
];
