import axios, { type AxiosInstance } from 'axios';
import { showApiError } from './../utils/toast.ts'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/boisson_war_exploded/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else {
      const msg = error.response?.data?.message || error.message || 'Erreur réseau';
      showApiError(msg)
    }
    return Promise.reject(error);
  }
);

export { api, API_BASE_URL };
