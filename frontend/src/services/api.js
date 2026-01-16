import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const auth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

export const projects = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`)
};

export const prompts = {
  create: (data) => api.post('/prompts', data),
  getByProject: (projectId) => api.get(`/prompts/project/${projectId}`)
};

export const chat = {
  send: (data) => api.post('/chat', data),
  getHistory: (projectId) => api.get(`/chat/history/${projectId}`)
};

export default api;
