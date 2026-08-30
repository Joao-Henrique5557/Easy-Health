import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { notificationsService } from "@/services/notificationsService";
import type { NotificationItem } from "@/data/notificationsMock";
import type { RootStackParamList } from "@/navigation/types";

const GROUP_LABEL: Record<NotificationItem["grupo"], string> = {
  hoje: "HOJE",
  ontem: "ONTEM",
  semana: "ESTA SEMANA",
};

export function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsService.list().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  function handlePress(notification: NotificationItem) {
    if (notification.lida) return;
    // Atualização otimista: marca como lida na UI imediatamente e envia a
    // confirmação para o backend em segundo plano.
    setItems((prev) => prev.map((n) => (n.id === notification.id ? { ...n, lida: true } : n)));
    notificationsService.markAsRead(notification.id);
  }

  const groups: NotificationItem["grupo"][] = ["hoje", "ontem", "semana"];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <ScreenHeader title="Notificações" onBack={() => navigation.goBack()} />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : items.length === 0 ? (
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, textAlign: "center", marginTop: 20 }}>
          Nenhuma notificação por aqui ainda.
        </Text>
      ) : (
        groups.map((grupo) => {
          const groupItems = items.filter((n) => n.grupo === grupo);
          if (groupItems.length === 0) return null;
          return (
            <View key={grupo} style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.inkFaint, letterSpacing: 0.5, marginBottom: 10 }}>
                {GROUP_LABEL[grupo]}
              </Text>
              <View style={{ gap: 8 }}>
                {groupItems.map((n) => (
                  <Pressable
                    key={n.id}
                    onPress={() => handlePress(n)}
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 10,
                      backgroundColor: colors.panel,
                      borderRadius: radius.lg,
                      padding: 13,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: colors.primarySoft,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={n.icon} size={16} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink }}>{n.titulo}</Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft, marginTop: 2 }}>
                        {n.descricao}
                      </Text>
                    </View>
                    {!n.lida && <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.primary, marginTop: 4 }} />}
                  </Pressable>
                ))}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}
