import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { DangerButton } from "@/components/Buttons";
import { firstAidService } from "@/services/firstAidService";
import { emergencyService } from "@/services/emergencyService";
import { EMERGENCY_NUMBERS } from "@/config/env";
import type { FirstAidGuide } from "@/data/firstAidContent";
import type { RootStackParamList } from "@/navigation/types";

export function FirstAidDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "FirstAidDetail">>();
  const [guide, setGuide] = useState<FirstAidGuide | null>(null);

  useEffect(() => {
    firstAidService.getById(route.params.id).then((g) => setGuide(g ?? null));
  }, [route.params.id]);

  // Mesma trava de segurança do resto do app: só abre o discador, quem
  // confirma a ligação é o usuário na tela do próprio sistema operacional.
  async function handleCallSamu() {
    try {
      await emergencyService.callNumber(EMERGENCY_NUMBERS.samu);
    } catch {
      Alert.alert("Não foi possível abrir o discador", `Ligue manualmente para ${EMERGENCY_NUMBERS.samu}.`);
    }
  }

  if (!guide) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <ScreenHeader title={guide.titulo} onBack={() => navigation.goBack()} />

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: colors.alertSoft,
          borderRadius: radius.md,
          padding: 13,
          marginBottom: 20,
        }}
      >
        <Ionicons name="time-outline" size={17} color={colors.alertDark} style={{ marginTop: 1 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: colors.alertDark }}>
            Situação de Emergência Grave?
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.alertDark, marginTop: 2, lineHeight: 17 }}>
            Em caso grave, ligue imediatamente para o {EMERGENCY_NUMBERS.samu} (SAMU).
          </Text>
        </View>
      </View>

      <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink, marginBottom: 14 }}>
        Passo a Passo de Resposta Rápida
      </Text>

      <View style={{ gap: 10, marginBottom: 24 }}>
        {guide.passos.map((passo, i) => {
          const [titulo, ...resto] = passo.split(": ");
          const temTitulo = resto.length > 0;
          return (
            <View key={i} style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: colors.primarySoft,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 11.5, color: colors.primaryDark }}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                {temTitulo && (
                  <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink, marginBottom: 2 }}>
                    {titulo}
                  </Text>
                )}
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, lineHeight: 19 }}>
                  {temTitulo ? resto.join(": ") : passo}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <DangerButton label={`Ligar SAMU (${EMERGENCY_NUMBERS.samu})`} onPress={handleCallSamu} />
    </ScrollView>
  );
}
