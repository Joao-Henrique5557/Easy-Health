import { api } from "./api";
import { NOTIFICATIONS_MOCK } from "@/data/notificationsMock";

// Bug corrigido: NotificationsScreen usava NOTIFICATIONS_MOCK
// diretamente, diferente de todas as outras telas do app (que sempre
// passam por um service com fallback para o mock). Isso significava que,
// mesmo com o backend no ar, a tela de notificações nunca refletia dados
// reais. Este service resolve essa inconsistência.
export const notificationsService = {
  async list() {
    try {
      const {
        data
      } = await api.get("/api/notificacoes");
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
    } catch {
      return NOTIFICATIONS_MOCK;
    }
  },
  async markAsRead(id) {
    try {
      await api.put(`/api/notificacoes/${id}/lida`);
    } catch {
      // Falha silenciosa: a UI já otimisticamente marca como lida.
    }
  },
  async markAllAsRead() {
    try {
      await api.put("/api/notificacoes/marcar-todas-lidas");
    } catch {
      // idem
    }
  }
};
