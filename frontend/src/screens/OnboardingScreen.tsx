import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import type { RootStackParamList } from "@/navigation/types";

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    icon: "information-circle-outline",
    title: "Informação Clara",
    desc: "Guias rápidos de primeiros socorros de fácil acesso offline.",
  },
  {
    icon: "clipboard-outline",
    title: "Organização Prática",
    desc: "Centralize seus exames, consultas e histórico médico.",
  },
  {
    icon: "location-outline",
    title: "Atendimento Rápido",
    desc: "Localize unidades do SUS e hospitais particulares em segundos.",
  },
];

export function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.xl, justifyContent: "center" }}>
      <View
        style={{
          width: 84,
          height: 84,
          borderRadius: 24,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          marginBottom: 28,
        }}
      >
        <Ionicons name="heart" size={38} color={colors.primary} />
      </View>

      <Text style={{ fontFamily: fonts.extraBold, fontSize: 27, color: colors.ink, textAlign: "center" }}>
        Easy Health
      </Text>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 14,
          color: colors.primary,
          textAlign: "center",
          marginTop: 6,
          marginBottom: 32,
        }}
      >
        Saúde mais simples, integrada e acessível.
      </Text>

      <View style={{ gap: 20, marginBottom: 40 }}>
        {FEATURES.map((f) => (
          <View key={f.title} style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            <Ionicons name={f.icon} size={20} color={colors.primary} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink }}>{f.title}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, marginTop: 2, lineHeight: 18 }}>
                {f.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <PrimaryButton label="Começar" onPress={() => navigation.navigate("Register")} />
        <SecondaryButton label="Já tenho conta" onPress={() => navigation.navigate("Login")} />
      </View>
    </View>
  );
}
