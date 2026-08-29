import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { firstAidService } from "@/services/firstAidService";
import type { FirstAidGuide } from "@/data/firstAidContent";
import type { RootStackParamList } from "@/navigation/types";

export function FirstAidDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "FirstAidDetail">>();
  const [guide, setGuide] = useState<FirstAidGuide | null>(null);

  useEffect(() => {
    firstAidService.getById(route.params.id).then((g) => setGuide(g ?? null));
  }, [route.params.id]);

  if (!guide) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink }}>{guide.titulo}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 13.5, color: colors.inkSoft, marginTop: 6, marginBottom: 18, lineHeight: 20 }}>
        {guide.resumo}
      </Text>

      {guide.passos.map((passo, i) => (
        <View key={i} style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: colors.primarySoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primaryDark }}>{i + 1}</Text>
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 13.5, color: colors.ink, lineHeight: 20 }}>
            {passo}
          </Text>
        </View>
      ))}

      <View style={{ backgroundColor: colors.primarySoft, borderRadius: 12, padding: 12, marginTop: 8 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.primaryDark, lineHeight: 17 }}>
          Este conteúdo é educativo e não substitui atendimento médico. Em caso de dúvida sobre a gravidade,
          ligue para o 192 (SAMU).
        </Text>
      </View>
    </ScrollView>
  );
}
