import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const animeService = {
  getAll: (params) => api.get('/animes', { params }),
  getById: (id) => api.get(`/animes/${id}`),
  getByCategory: (category) => api.get(`/animes/category/${category}`),
  getTopRated: () => api.get('/animes/top/rated'),
  create: (data) => api.post('/animes', data),
  update: (id, data) => api.put(`/animes/${id}`, data),
  delete: (id) => api.delete(`/animes/${id}`),
};

export const ratingService = {
  create: (animeId, rating) => api.post('/ratings', { animeId, rating }),
  getUserRating: (animeId) => api.get(`/ratings/anime/${animeId}`),
  getAll: (animeId) => api.get(`/ratings/anime/${animeId}/all`),
  delete: (id) => api.delete(`/ratings/${id}`),
};

export const commentService = {
  getByAnime: (animeId) => api.get(`/comments/anime/${animeId}`),
  create: (animeId, content, parentCommentId = null) =>
    api.post('/comments', { animeId, content, parentCommentId }),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`),
};

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const animeRequestService = {
  create: (animeName, userEmail, userName) =>
    api.post('/anime-requests', { animeName, userEmail, userName }),
  getAll: (params) => api.get('/anime-requests', { params }),
  updateStatus: (id, status, adminNotes) =>
    api.put(`/anime-requests/${id}`, { status, adminNotes }),
  delete: (id) => api.delete(`/anime-requests/${id}`),
};

export default api;
