import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { firstAidService } from "@/services/firstAidService";
import type { FirstAidGuide } from "@/data/firstAidContent";
import type { RootStackParamList } from "@/navigation/types";

export function FirstAidScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [guides, setGuides] = useState<FirstAidGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firstAidService.list().then((data) => {
      setGuides(data);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <ScreenHeader title="Primeiros Socorros" onBack={() => navigation.goBack()} />

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: colors.alertSoft,
          borderRadius: radius.md,
          padding: 12,
          marginBottom: 18,
        }}
      >
        <Ionicons name="warning" size={17} color={colors.alertDark} style={{ marginTop: 1 }} />
        <Text style={{ flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.alertDark, lineHeight: 17 }}>
          Informativo — não substitui atendimento médico de urgência.
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginBottom: 12 }}>
        Guia de Resposta Rápida
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {guides.map((guide) => (
            <Pressable
              key={guide.id}
              onPress={() => navigation.navigate("FirstAidDetail", { id: guide.id })}
              style={({ pressed }) => ({
                flexBasis: "48%",
                backgroundColor: colors.panel,
                borderRadius: radius.lg,
                padding: 16,
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: radius.md,
                  backgroundColor: colors.primarySoft,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Ionicons name={guide.icon as keyof typeof Ionicons.glyphMap} size={19} color={colors.primary} />
              </View>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink }}>{guide.titulo}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
