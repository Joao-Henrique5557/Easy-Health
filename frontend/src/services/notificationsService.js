import { api } from "./api";
import { tokenStorage } from "./tokenStorage";

export const notificationsService = {
  async list() {
    if (!(await tokenStorage.hasAccessToken())) {
      return [];
    }
    const { data } = await api.get("/api/notificacoes");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return data.map(notification => {
      const createdAt = new Date(notification.createdAt);
      createdAt.setHours(0, 0, 0, 0);
      const grupo = createdAt >= today
        ? "hoje"
        : createdAt >= yesterday
          ? "ontem"
          : createdAt >= weekAgo
            ? "semana"
            : null;
      return {
        ...notification,
        icon: notification.icon || "notifications",
        grupo
      };
    }).filter(notification => notification.grupo);
  },
  async markAsRead(id) {
    await api.put(`/api/notificacoes/${id}/lida`);
  },
  async markAllAsRead() {
    await api.put("/api/notificacoes/marcar-todas-lidas");
  }
};
