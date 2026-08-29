import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { api } from "./api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  /** Cria o canal de notificação exigido pelo Android 8+ para notificações aparecerem. */
  async setupAndroidChannel() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Easy Health",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#146B63",
      });
    }
  },

  /** Pede permissão e registra o token do dispositivo (expo push token) no backend. */
  async registerForPushNotifications() {
    if (!Device.isDevice) return null; // emuladores não recebem push de verdade

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    await this.setupAndroidChannel();

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    try {
      await api.post("/api/users/me/push-token", { token });
    } catch {
      // Falha ao registrar não deve travar o app — tenta de novo no próximo login.
    }

    return token;
  },

  async listNotifications() {
    const { data } = await api.get("/api/notificacoes");
    return data;
  },

  async markAsRead(id: string) {
    await api.put(`/api/notificacoes/${id}/lida`);
  },
};
