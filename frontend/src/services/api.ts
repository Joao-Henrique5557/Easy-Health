import axios from 'axios';
import { API_URL } from '@/config/env';
import { tokenStorage } from './tokenStorage';

interface InternalAxiosRequestConfig extends axios.AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor: adiciona o token de acesso
api.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: trata 401 renovando o token
api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const original = error.config as InternalAxiosRequestConfig;

    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve) => {
        pendingQueue.push(() => resolve());
      }).then(() => api(original));
    }

    isRefreshing = true;
    original._retry = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw error;

      const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken,
      });

      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      pendingQueue.forEach((fn) => fn());
      pendingQueue = [];

      return api(original);
    } catch (refreshError) {
      await tokenStorage.clear();
      pendingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const registerUser = (payload: any) => api.post('/api/auth/register', payload);
