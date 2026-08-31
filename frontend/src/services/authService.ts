import { api } from "./api";
import { tokenStorage } from "./tokenStorage";

export interface RegisterPayload {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  dataNascimento?: string; // ISO 8601 (AAAA-MM-DD)
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: { id: string; nome: string; email: string };
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout() {
    try {
      await api.post("/api/auth/logout");
    } finally {
      await tokenStorage.clear();
    }
  },

  async forgotPassword(email: string) {
    await api.post("/api/auth/forgot-password", { email });
  },

  async resetPassword(codigo: string, novaSenha: string) {
    await api.post("/api/auth/reset-password", { codigo, novaSenha });
  },

  async isAuthenticated() {
    return Boolean(await tokenStorage.getAccessToken());
  },
};
