import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
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
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Educativo
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4 }}>
        Primeiros Socorros
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 6, marginBottom: 16, lineHeight: 19 }}>
        Conteúdo informativo, validado por profissionais de saúde. Não substitui atendimento médico.
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={guides}
          keyExtractor={(g) => g.id}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate("FirstAidDetail", { id: item.id })}
              style={{
                backgroundColor: colors.panel,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 14,
                padding: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.ink }}>{item.titulo}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 2 }}>{item.resumo}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
