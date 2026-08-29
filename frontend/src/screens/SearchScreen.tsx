import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { ClinicCard } from "@/components/ClinicCard";
import { useLocation } from "@/hooks/useLocation";
import { establishmentsService, Establishment } from "@/services/establishmentsService";

export function SearchScreen() {
  const { coords, loading: loadingLocation, error, permissionDenied } = useLocation();
  const [results, setResults] = useState<Establishment[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    if (!coords) return;
    setLoadingResults(true);
    establishmentsService
      .search({ latitude: coords.latitude, longitude: coords.longitude, raioKm: 10 })
      .then(setResults)
      .finally(() => setLoadingResults(false));
  }, [coords]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Atendimento
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4 }}>
        Buscar Atendimento
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: colors.inkSoft, marginTop: 6, marginBottom: 16, lineHeight: 19 }}>
        Hospitais, clínicas e UBS próximos de você, com distância e preço estimado.
      </Text>

      {permissionDenied && (
        <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.alertDark, marginBottom: 12 }}>
          Precisamos da sua localização para mostrar distâncias reais. Ative a permissão de localização nas
          configurações do app.
        </Text>
      )}
      {error && !permissionDenied && (
        <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.alertDark, marginBottom: 12 }}>
          {error}
        </Text>
      )}

      {(loadingLocation || loadingResults) ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => <ClinicCard item={item} />}
          ListEmptyComponent={
            <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.inkSoft }}>
              Nenhum estabelecimento encontrado por perto.
            </Text>
          }
        />
      )}
    </View>
  );
}
