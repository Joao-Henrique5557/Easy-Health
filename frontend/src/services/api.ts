import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/config/env";
import { tokenStorage } from "./tokenStorage";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 12000,
});

// Anexa o Bearer Token em toda requisição autenticada (regra do readme, seção 21).
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

// Se o token expirar (401), tenta renovar uma única vez via
// POST /api/auth/refresh-token antes de derrubar a sessão do usuário.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      await new Promise<void>((resolve) => pendingQueue.push(resolve));
      return api(original);
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) throw error;

      const { data } = await axios.post(`${API_URL}/api/auth/refresh-token`, {
        refreshToken,
      });
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);

      pendingQueue.forEach((resolve) => resolve());
      pendingQueue = [];

      return api(original);
    } catch (refreshError) {
      await tokenStorage.clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
