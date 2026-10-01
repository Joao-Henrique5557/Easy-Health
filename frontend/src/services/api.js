import axios from 'axios';
import { API_URL } from '@/config/env';
import { tokenStorage } from './tokenStorage';
let isRefreshing = false;
let pendingQueue = [];
const settlePendingRequests = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};
export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Request interceptor: adiciona o token de acesso
api.interceptors.request.use(async config => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Response interceptor: trata 401 renovando o token
api.interceptors.response.use(response => response, async error => {
  const original = error.config;
  const isAuthRequest = original?.url?.includes('/api/auth/login')
    || original?.url?.includes('/api/auth/register')
    || original?.url?.includes('/api/auth/refresh-token');
  if (error.response?.status !== 401 || !original || original._retry || isAuthRequest) {
    return Promise.reject(error);
  }
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    }).then(token => {
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    });
  }
  isRefreshing = true;
  original._retry = true;
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) throw error;
    const {
      data
    } = await axios.post(`${API_URL}/api/auth/refresh-token`, {
      refreshToken
    });
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    settlePendingRequests(null, data.accessToken);
    original.headers.Authorization = `Bearer ${data.accessToken}`;
    return api(original);
  } catch (refreshError) {
    await tokenStorage.clear();
    settlePendingRequests(refreshError);
    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
});
export const registerUser = payload => api.post('/api/auth/register', payload);
