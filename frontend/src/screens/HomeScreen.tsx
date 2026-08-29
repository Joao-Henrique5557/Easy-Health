import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { Tile } from "@/components/Tile";
import { Pill } from "@/components/Pill";
import { Avatar } from "@/components/Avatar";
import { AssistantFab } from "@/components/AssistantFab";
import { AssistantPanel } from "@/components/AssistantPanel";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { profileService, UserProfile } from "@/services/profileService";
import { bookingService, Booking } from "@/services/bookingService";
import { formatDateShort } from "@/utils/date";
import type { AssistantScreen } from "@/services/assistantService";

export function HomeScreen() {
  const navigation = useAppNavigation();
  const [chatOpen, setChatOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    profileService.getMe().then(setProfile);
    bookingService.listUpcoming().then(setBookings);
  }, []);

  function handleAssistantNavigate(screen: Exclude<AssistantScreen, null>) {
    setChatOpen(false);
    if (screen === "emergencia") navigation.navigate("Emergency");
    else if (screen === "primeiros_socorros") navigation.navigate("FirstAid");
    else if (screen === "busca_atendimento") navigation.navigate("Search");
    else if (screen === "historico") navigation.navigate("History");
    else if (screen === "perfil") navigation.navigate("Profile");
    else navigation.navigate("Home");
  }

  function submitSearch() {
    navigation.navigate("Search", { query: searchText || undefined });
  }

  const primeiroNome = profile?.nome?.split(" ")[0] ?? "";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
        {/* Cabeçalho: avatar + saudação + notificações */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
          <Avatar uri={profile?.avatarUrl} size={44} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft }}>
              Olá, seja bem-vinda
            </Text>
            <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.ink }}>
              {profile?.nome ?? "..."}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("Notifications")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.panel,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="notifications-outline" size={19} color={colors.ink} />
          </Pressable>
        </View>

        {/* Banner Modo Emergência */}
        <Pressable
          onPress={() => navigation.navigate("Emergency")}
          style={({ pressed }) => ({
            backgroundColor: colors.alert,
            borderRadius: radius.lg,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.18)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="alarm-outline" size={19} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.white }}>Modo Emergência</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: "rgba(255,255,255,0.85)" }}>
              Suporte imediato & SAMU 192
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.white} />
        </Pressable>

        {/* Busca */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colors.panel,
            borderRadius: radius.md,
            paddingHorizontal: 14,
            marginBottom: 22,
          }}
        >
          <Ionicons name="search" size={17} color={colors.inkFaint} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={submitSearch}
            placeholder="Buscar serviços de saúde..."
            placeholderTextColor={colors.inkFaint}
            style={{ flex: 1, paddingVertical: 13, fontFamily: fonts.regular, fontSize: 13, color: colors.ink }}
          />
        </View>

        {/* Serviços integrados */}
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 12 }}>
          Serviços Integrados
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <Tile
            label="Primeiros Socorros"
            desc="Guias úteis offline"
            icon="medkit-outline"
            onPress={() => navigation.navigate("FirstAid")}
          />
          <Tile
            label="Buscar Atendimento"
            desc="Unidades do SUS e mais"
            icon="location-outline"
            onPress={() => navigation.navigate("Search")}
          />
          <Tile
            label="Meu Histórico"
            desc="Histórico integrado"
            icon="clipboard-outline"
            onPress={() => navigation.navigate("History")}
          />
          <Tile
            label="Agendamentos"
            desc="Gerenciar consultas"
            icon="calendar-outline"
            onPress={() => navigation.navigate("History")}
          />
        </View>

        {/* Próximas consultas */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink }}>Próximas Consultas</Text>
          <Pressable onPress={() => navigation.navigate("History")}>
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.primary }}>Ver todas</Text>
          </Pressable>
        </View>

        {bookings.map((booking) => (
          <View key={booking.id} style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Avatar size={38} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink }}>{booking.medico}</Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft, marginTop: 1 }}>
                  {booking.especialidade} • {booking.establishmentNome}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.line,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Ionicons name="time-outline" size={14} color={colors.inkSoft} />
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.inkSoft }}>
                  {formatDateShort(booking.data)} às {booking.horario}
                </Text>
              </View>
              <Pill>Confirmada</Pill>
            </View>
          </View>
        ))}
      </ScrollView>

      <AssistantFab onPress={() => setChatOpen(true)} />
      <AssistantPanel visible={chatOpen} onClose={() => setChatOpen(false)} onNavigate={handleAssistantNavigate} />
    </View>
  );
}
