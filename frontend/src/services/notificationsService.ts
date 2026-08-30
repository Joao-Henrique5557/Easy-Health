import { api } from "./api";
import { NOTIFICATIONS_MOCK, NotificationItem } from "@/data/notificationsMock";

// Bug corrigido: NotificationsScreen.tsx usava NOTIFICATIONS_MOCK
// diretamente, diferente de todas as outras telas do app (que sempre
// passam por um service com fallback para o mock). Isso significava que,
// mesmo com o backend no ar, a tela de notificações nunca refletia dados
// reais. Este service resolve essa inconsistência.
export const notificationsService = {
  async list(): Promise<NotificationItem[]> {
    try {
      const { data } = await api.get<NotificationItem[]>("/api/notificacoes");
      return data;
    } catch {
      return NOTIFICATIONS_MOCK;
    }
  },

  async markAsRead(id: string) {
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
  },
};
