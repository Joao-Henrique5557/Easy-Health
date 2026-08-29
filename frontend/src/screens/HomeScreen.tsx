import React, { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { Tile } from "@/components/Tile";
import { AssistantFab } from "@/components/AssistantFab";
import { AssistantPanel } from "@/components/AssistantPanel";
import type { RootStackParamList, MainTabsParamList } from "@/navigation/types";
import type { AssistantScreen } from "@/services/assistantService";

type Nav = BottomTabNavigationProp<MainTabsParamList> & NativeStackNavigationProp<RootStackParamList>;

const TAB_MAP: Record<Exclude<AssistantScreen, "emergencia" | null>, keyof MainTabsParamList> = {
  home: "Home",
  primeiros_socorros: "FirstAid",
  busca_atendimento: "Search",
  historico: "History",
  perfil: "Profile",
};

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [chatOpen, setChatOpen] = useState(false);

  function handleAssistantNavigate(screen: Exclude<AssistantScreen, null>) {
    setChatOpen(false);
    if (screen === "emergencia") {
      navigation.navigate("Emergency");
    } else {
      navigation.navigate(TAB_MAP[screen]);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
          Easy Health
        </Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginTop: 4 }}>
          Olá! Como podemos ajudar hoje?
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: colors.inkSoft, marginTop: 6, lineHeight: 20 }}>
          Toque em uma opção abaixo ou converse com o assistente para ser guiado até o que você precisa.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
          <Tile label="Primeiros Socorros" desc="Guias rápidos e validados" icon="heart" onPress={() => navigation.navigate("FirstAid")} />
          <Tile label="Buscar Atendimento" desc="Hospitais, clínicas e UBS perto de você" icon="search" onPress={() => navigation.navigate("Search")} />
          <Tile label="Meu Histórico" desc="Consultas e exames" icon="time" onPress={() => navigation.navigate("History")} />
          <Tile label="Meu Perfil" desc="Seus dados cadastrais" icon="person" onPress={() => navigation.navigate("Profile")} />
        </View>

        <Pressable
          onPress={() => navigation.navigate("Emergency")}
          style={({ pressed }) => ({
            marginTop: 14,
            backgroundColor: colors.alert,
            borderRadius: 16,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Ionicons name="warning" size={22} color={colors.white} />
          <View>
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white }}>Modo Emergência</Text>
            <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: "#FFE4D9" }}>
              Números reais de socorro, sempre um toque de distância
            </Text>
          </View>
        </Pressable>
      </ScrollView>

      <AssistantFab onPress={() => setChatOpen(true)} />
      <AssistantPanel visible={chatOpen} onClose={() => setChatOpen(false)} onNavigate={handleAssistantNavigate} />
    </View>
  );
}
