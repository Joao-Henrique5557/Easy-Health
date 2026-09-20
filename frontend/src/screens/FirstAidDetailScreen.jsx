import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { DangerButton } from "@/components/Buttons";
import { firstAidService } from "@/services/firstAidService";
import { emergencyService } from "@/services/emergencyService";
import { EMERGENCY_NUMBERS } from "@/config/env";
import { useToast } from "@/components/Toast";
export function FirstAidDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    showToast
  } = useToast();
  useEffect(() => {
    firstAidService.getById(route.params.id).then(g => setGuide(g ?? null)).finally(() => setLoading(false));
  }, [route.params.id]);

  // Mesma trava de segurança do resto do app: só abre o discador, quem
  // confirma a ligação é o usuário na tela do próprio sistema operacional.
  async function handleCallSamu() {
    try {
      await emergencyService.callNumber(EMERGENCY_NUMBERS.samu);
    } catch {
      showToast(`Não foi possível abrir o discador. Ligue manualmente para ${EMERGENCY_NUMBERS.samu}.`);
    }
  }
  if (loading) {
    return <View style={{
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center"
    }}>
        <ActivityIndicator color={colors.primary} />
      </View>;
  }
  if (!guide) {
    return <View style={{
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg
    }}>
        <Text style={{
        color: colors.ink,
        fontFamily: fonts.semiBold,
        marginBottom: 12
      }}>Guia não encontrado.</Text>
        <Text onPress={() => navigation.goBack()} style={{
        color: colors.primary,
        fontFamily: fonts.semiBold
      }}>Voltar</Text>
      </View>;
  }
  return <ScrollView style={{
    flex: 1,
    backgroundColor: colors.bg
  }} contentContainerStyle={{
    padding: spacing.lg,
    paddingTop: spacing.xl
  }}>
      <ScreenHeader title={guide.titulo} onBack={() => navigation.goBack()} />

      <View style={{
      flexDirection: "row",
      gap: 10,
      backgroundColor: colors.alertSoft,
      borderRadius: radius.md,
      padding: 13,
      marginBottom: 20
    }}>
        <Ionicons name="time-outline" size={17} color={colors.alertDark} style={{
        marginTop: 1
      }} />
        <View style={{
        flex: 1
      }}>
          <Text style={{
          fontFamily: fonts.bold,
          fontSize: 12.5,
          color: colors.alertDark
        }}>
            Situação de Emergência Grave?
          </Text>
          <Text style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          color: colors.alertDark,
          marginTop: 2,
          lineHeight: 17
        }}>
            Em caso grave, ligue imediatamente para o {EMERGENCY_NUMBERS.samu} (SAMU).
          </Text>
        </View>
      </View>

      <Text style={{
      fontFamily: fonts.bold,
      fontSize: 14.5,
      color: colors.ink,
      marginBottom: 14
    }}>
        Passo a Passo de Resposta Rápida
      </Text>

      <View style={{
      gap: 10,
      marginBottom: 24
    }}>
        {guide.passos.map((passo, i) => {
        const [titulo, ...resto] = passo.split(": ");
        const temTitulo = resto.length > 0;
        return <View key={i} style={{
          backgroundColor: colors.panel,
          borderRadius: radius.lg,
          padding: 14,
          flexDirection: "row",
          gap: 12
        }}>
              <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1
          }}>
                <Text style={{
              fontFamily: fonts.bold,
              fontSize: 11.5,
              color: colors.primaryDark
            }}>{i + 1}</Text>
              </View>
              <View style={{
            flex: 1
          }}>
                {temTitulo && <Text style={{
              fontFamily: fonts.bold,
              fontSize: 13.5,
              color: colors.ink,
              marginBottom: 2
            }}>
                    {titulo}
                  </Text>}
                <Text style={{
              fontFamily: fonts.regular,
              fontSize: 12.5,
              color: colors.inkSoft,
              lineHeight: 19
            }}>
                  {temTitulo ? resto.join(": ") : passo}
                </Text>
              </View>
            </View>;
      })}
      </View>

      <DangerButton label={`Ligar SAMU (${EMERGENCY_NUMBERS.samu})`} onPress={handleCallSamu} />
    </ScrollView>;
}
