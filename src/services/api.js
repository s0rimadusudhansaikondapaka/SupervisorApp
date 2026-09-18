import axios from 'axios';

const getStoredBaseUrl = () => {
  return localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getStoredBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supervisor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('supervisor_token');
      localStorage.removeItem('supervisor_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getBaseUrl = () => {
  return localStorage.getItem('api_base_url') || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

export const setBaseUrl = (url) => {
  if (url) {
    localStorage.setItem('api_base_url', url);
    api.defaults.baseURL = url;
  }
};

export const loginSupervisor = async (credentials) => {
  const response = await api.post('/auth/supervisor/login', credentials);
  return response.data;
};

export const logoutSupervisor = async () => {
  localStorage.removeItem('supervisor_token');
  localStorage.removeItem('supervisor_user');
};

export default api;
