import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { emergencyService } from "@/services/emergencyService";
import { profileService, UserProfile } from "@/services/profileService";
import { EMERGENCY_NUMBERS } from "@/config/env";
import type { RootStackParamList } from "@/navigation/types";

function ActionRow({
  icon,
  title,
  subtitle,
  danger,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: danger ? colors.alert : colors.emergencyCard,
        borderRadius: radius.lg,
        padding: 16,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: "rgba(255,255,255,0.15)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={19} color={colors.white} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.white }}>{title}</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: danger ? "rgba(255,255,255,0.85)" : colors.emergencyTextSoft }}>
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={danger ? colors.white : colors.emergencyTextSoft} />
    </Pressable>
  );
}

function FichaRow({ label, value, valueColor, half }: { label: string; value: string; valueColor?: string; half?: boolean }) {
  return (
    <View style={{ flex: half ? 1 : undefined }}>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 10, color: colors.emergencyTextSoft, letterSpacing: 0.4, marginBottom: 3 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: valueColor ?? colors.white }}>{value}</Text>
    </View>
  );
}

export function EmergencyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    profileService.getMe().then(setProfile);
  }, []);

  // A ÚNICA ação de ligação do app: abre o discador nativo.
  // A ligação em si só ocorre se o usuário confirmar na tela do sistema.
  async function handleCall(numero: string) {
    try {
      await emergencyService.callNumber(numero);
    } catch {
      Alert.alert("Não foi possível abrir o discador", `Ligue manualmente para ${numero}.`);
    }
  }

  const idade = profile?.dataNascimento ? profileService.calcularIdade(profile.dataNascimento) : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.emergencyBg }}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={{ width: 32 }}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </Pressable>
          <Text style={{ flex: 1, textAlign: "center", fontFamily: fonts.extraBold, fontSize: 16, color: colors.white, letterSpacing: 0.5 }}>
            EMERGÊNCIA
          </Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={{ alignItems: "center", marginBottom: 26 }}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: "rgba(239,68,68,0.18)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.alert,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="alarm" size={28} color={colors.white} />
            </View>
          </View>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 18, color: colors.white, marginBottom: 4 }}>
            Precisa de ajuda urgente?
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: "#F87171" }}>
            Selecione uma das ações imediatas abaixo.
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 30 }}>
          <ActionRow
            icon="call"
            title={`Ligar SAMU (${EMERGENCY_NUMBERS.samu})`}
            subtitle="Chamada de emergência direta"
            danger
            onPress={() => handleCall(EMERGENCY_NUMBERS.samu)}
          />
          <ActionRow
            icon="map"
            title="Hospitais Próximos"
            subtitle="Rotas de urgência no mapa"
            onPress={() => navigation.navigate("MainTabs", { screen: "Search", params: { query: "hospital" } })}
          />
          <ActionRow
            icon="medkit"
            title="Primeiros Socorros"
            subtitle="Ver instruções rápidas offline"
            onPress={() => navigation.navigate("FirstAid")}
          />
        </View>

        <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.white, marginBottom: 12 }}>
          Ficha Médica do Usuário
        </Text>
        <View style={{ backgroundColor: colors.emergencyCard, borderRadius: radius.lg, padding: 16 }}>
          <FichaRow label="Nome do Paciente" value={profile?.nome ?? "—"} />
          <View style={{ height: 1, backgroundColor: colors.emergencyLine, marginVertical: 14 }} />
          <View style={{ flexDirection: "row" }}>
            <FichaRow label="Tipo Sanguíneo" value={profile?.tipoSanguineo ?? "—"} valueColor={colors.alert} half />
            <FichaRow label="Idade" value={idade !== null ? `${idade} anos` : "—"} half />
          </View>
          <View style={{ height: 1, backgroundColor: colors.emergencyLine, marginVertical: 14 }} />
          <FichaRow label="Alergias Conhecidas" value={profile?.alergias || "Nenhuma informada"} />
          <View style={{ height: 1, backgroundColor: colors.emergencyLine, marginVertical: 14 }} />
          <FichaRow
            label="Contato de Emergência"
            value={
              profile?.contatoEmergenciaNome
                ? `${profile.contatoEmergenciaNome} (${profile.contatoEmergenciaParentesco}) - ${profile.contatoEmergenciaTelefone}`
                : "Nenhum contato cadastrado"
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
