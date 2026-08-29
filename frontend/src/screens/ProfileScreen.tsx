import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { Avatar } from "@/components/Avatar";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { profileService, UserProfile } from "@/services/profileService";
import { authService } from "@/services/authService";

const MENU_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; route: "EditProfile" | "Favorites" | "Notifications" }[] = [
  { icon: "person-outline", label: "Editar Perfil", route: "EditProfile" },
  { icon: "heart-outline", label: "Favoritos", route: "Favorites" },
  { icon: "notifications-outline", label: "Notificações", route: "Notifications" },
];

export function ProfileScreen() {
  const navigation = useAppNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    profileService.getMe().then(setProfile);
  }, []);

  function handleLogout() {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          // A navegação de volta ao Login é tratada pelo listener de
          // autenticação no App.tsx, que observa o token armazenado.
        },
      },
    ]);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 19, color: colors.ink, marginBottom: 20 }}>Perfil</Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Avatar uri={profile?.avatarUrl} size={56} />
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.ink }}>{profile?.nome ?? "..."}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft }}>{profile?.email}</Text>
        </View>
      </View>

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, overflow: "hidden", marginBottom: 20 }}>
        {MENU_ITEMS.map((item, i) => (
          <Pressable
            key={item.route}
            onPress={() => navigation.navigate(item.route)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 15,
              borderBottomWidth: i === MENU_ITEMS.length - 1 ? 0 : 1,
              borderBottomColor: colors.line,
            }}
          >
            <Ionicons name={item.icon} size={18} color={colors.primary} />
            <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13.5, color: colors.ink }}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleLogout} style={{ alignItems: "center", paddingVertical: 10 }}>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.alertDark }}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}
