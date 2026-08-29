import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Pill } from "@/components/Pill";
import { favoritesService } from "@/services/favoritesService";
import type { Establishment } from "@/services/establishmentsService";
import type { RootStackParamList } from "@/navigation/types";

const TIPO_LABEL: Record<Establishment["tipo"], string> = {
  hospital: "Hospital",
  clinica: "Clínica",
  ubs: "UBS",
  upa: "UPA",
  laboratorio: "Laboratório",
};

export function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [favorites, setFavorites] = useState<Establishment[]>([]);

  const load = useCallback(() => {
    favoritesService.list().then(setFavorites);
  }, []);

  // Recarrega sempre que a tela ganha foco, para refletir favoritos
  // adicionados/removidos em outra tela (ex: Detalhe do Estabelecimento).
  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleRemove(id: string) {
    await favoritesService.remove(id);
    load();
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <ScreenHeader title="Favoritos" onBack={() => navigation.goBack()} />

      {favorites.length === 0 ? (
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, textAlign: "center", marginTop: 20 }}>
          Adicione favoritos tocando no coração nos resultados de busca.
        </Text>
      ) : (
        <View style={{ gap: 10 }}>
          {favorites.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => navigation.navigate("EstablishmentDetail", { id: item.id })}
              style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14 }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Pill>{TIPO_LABEL[item.tipo]}</Pill>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
                    {item.distanciaKm.toFixed(1)} km
                  </Text>
                </View>
                <Pressable onPress={() => handleRemove(item.id)} hitSlop={8}>
                  <Ionicons name="heart" size={18} color={colors.alert} />
                </Pressable>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginTop: 6 }}>{item.nome}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>
                {item.endereco}
              </Text>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary, marginTop: 8 }}>
                Agendar Atendimento
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
