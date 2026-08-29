import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PillTabs } from "@/components/PillTabs";
import { ClinicCard } from "@/components/ClinicCard";
import { useLocation } from "@/hooks/useLocation";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { establishmentsService, Establishment } from "@/services/establishmentsService";
import { emergencyService } from "@/services/emergencyService";
import type { MainTabsParamList } from "@/navigation/types";

type Filtro = "todos" | "hospital" | "clinica" | "ubs" | "upa";

const FILTERS: { value: Filtro; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "hospital", label: "Hospitais" },
  { value: "clinica", label: "Clínicas" },
  { value: "ubs", label: "UBS" },
  { value: "upa", label: "UPA" },
];

export function SearchScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<MainTabsParamList, "Search">>();
  const { coords } = useLocation();
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [query, setQuery] = useState(route.params?.query ?? "");
  const [results, setResults] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    establishmentsService
      .search({
        latitude: coords?.latitude ?? 0,
        longitude: coords?.longitude ?? 0,
        tipo: filtro,
        query: query || undefined,
        raioKm: 10,
      })
      .then(setResults)
      .finally(() => setLoading(false));
  }, [coords, filtro, query]);

  async function handleRoute(item: Establishment) {
    try {
      await emergencyService.openRouteInMaps({ latitude: item.latitude, longitude: item.longitude }, item.nome);
    } catch {
      Alert.alert("Não foi possível abrir o mapa", "Tente novamente em instantes.");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 19, color: colors.ink, marginBottom: 16 }}>Buscar Atendimento</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: colors.panel,
          borderRadius: radius.md,
          paddingHorizontal: 14,
          marginBottom: 12,
        }}
      >
        <Ionicons name="search" size={16} color={colors.inkFaint} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Hospitais próximos"
          placeholderTextColor={colors.inkFaint}
          style={{ flex: 1, paddingVertical: 13, fontFamily: fonts.regular, fontSize: 13, color: colors.ink }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <PillTabs options={FILTERS} value={filtro} onChange={setFiltro} />
      </View>

      {/* Ilustração de mapa — o mapa real (react-native-maps) fica para uma
          fase seguinte; por ora, um preview estático evita adicionar uma
          dependência nativa pesada só para o protótipo acadêmico. */}
      <View
        style={{
          height: 130,
          borderRadius: radius.lg,
          backgroundColor: colors.primaryDark,
          marginBottom: 20,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Ionicons name="map-outline" size={28} color="rgba(255,255,255,0.5)" />
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
          Mapa com unidades próximas
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink, marginBottom: 12 }}>
        Resultados Próximos
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : results.length === 0 ? (
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft }}>
          Nenhum estabelecimento encontrado por perto.
        </Text>
      ) : (
        <View style={{ gap: 10 }}>
          {results.map((item) => (
            <ClinicCard
              key={item.id}
              item={item}
              onPress={() => navigation.navigate("EstablishmentDetail", { id: item.id })}
              onPressRoute={() => handleRoute(item)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
