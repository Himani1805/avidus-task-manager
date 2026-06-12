import axios from 'axios';

// Create a centralized axios instance
const api = axios.create({
  // baseURL: 'http://localhost:5000/api',
  baseURL:'https://avidus-task-manager-mt6h.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach token to requests
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

export default api;