import axios from 'axios';

const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : 'https://api.fixlyhandy.com/api/v1';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;