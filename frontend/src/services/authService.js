import { api } from "./api";
import { tokenStorage } from "./tokenStorage";
export const authService = {
  async register(payload) {
    const {
      data
    } = await api.post("/api/auth/register", payload);
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },
  async login(payload) {
    const {
      data
    } = await api.post("/api/auth/login", payload);
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
  async forgotPassword(email) {
    await api.post("/api/auth/forgot-password", {
      email
    });
  },
  async resetPassword(codigo, novaSenha) {
    await api.post("/api/auth/reset-password", {
      codigo,
      novaSenha
    });
  },
  async isAuthenticated() {
    return Boolean(await tokenStorage.getAccessToken());
  }
};
