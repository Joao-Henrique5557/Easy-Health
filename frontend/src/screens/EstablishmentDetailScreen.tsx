import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Pill } from "@/components/Pill";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { establishmentsService, Establishment } from "@/services/establishmentsService";
import { favoritesService } from "@/services/favoritesService";
import { emergencyService } from "@/services/emergencyService";
import type { RootStackParamList } from "@/navigation/types";

export function EstablishmentDetailScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "EstablishmentDetail">>();
  const [item, setItem] = useState<Establishment | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    establishmentsService.getById(route.params.id).then((data) => {
      setItem(data ?? null);
      if (data) setIsFavorite(favoritesService.isFavorite(data.id));
    });
  }, [route.params.id]);

  async function toggleFavorite() {
    if (!item) return;
    if (isFavorite) {
      await favoritesService.remove(item.id);
    } else {
      await favoritesService.add(item.id);
    }
    setIsFavorite((v) => !v);
  }

  async function handleRoute() {
    if (!item) return;
    try {
      await emergencyService.openRouteInMaps({ latitude: item.latitude, longitude: item.longitude }, item.nome);
    } catch {
      Alert.alert("Não foi possível abrir o mapa", "Tente novamente em instantes.");
    }
  }

  if (!item) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }}>
      <ScreenHeader
        title={item.nome}
        onBack={() => navigation.goBack()}
        rightIcon={isFavorite ? "heart" : "heart-outline"}
        rightActive={isFavorite}
        onPressRight={toggleFavorite}
      />

      <View
        style={{
          height: 160,
          borderRadius: radius.lg,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <Ionicons name="business-outline" size={40} color={colors.primary} />
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Pill>{item.tipo === "hospital" ? "Hospital" : item.tipo.toUpperCase()}</Pill>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Ionicons name="star" size={13} color={colors.primary} />
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink }}>
            {item.avaliacao.toFixed(1)} {item.avaliacoesCount ? `(${item.avaliacoesCount} avaliações)` : ""}
          </Text>
        </View>
      </View>

      <Text style={{ fontFamily: fonts.extraBold, fontSize: 19, color: colors.ink, marginBottom: 12 }}>
        {item.nome}
      </Text>

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, gap: 10, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="location-outline" size={16} color={colors.primary} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink }}>{item.endereco}</Text>
        </View>
        {item.telefone && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="call-outline" size={16} color={colors.primary} />
            <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.ink }}>{item.telefone}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.primary }}>{item.horario}</Text>
        </View>
      </View>

      {item.especialidades && item.especialidades.length > 0 && (
        <>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 10 }}>
            Especialidades
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {item.especialidades.map((esp) => (
              <View key={esp} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink }}>{esp}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {item.precos && item.precos.length > 0 && (
        <>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 10 }}>
            Preços Estimados
          </Text>
          <View style={{ gap: 8, marginBottom: 20 }}>
            {item.precos.map((p) => (
              <View key={p.servico} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft }}>{p.servico}</Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 12.5, color: colors.primary }}>{p.valor}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {item.convenios && item.convenios.length > 0 && (
        <>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginBottom: 10 }}>
            Convênios Aceitos
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {item.convenios.map((c) => (
              <View key={c} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink }}>{c}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ gap: 10 }}>
        <PrimaryButton label="Agendar Consulta" onPress={() => navigation.navigate("Booking", { establishmentId: item.id })} />
        <SecondaryButton label="Como Chegar" icon="navigate-outline" onPress={handleRoute} />
      </View>
    </ScrollView>
  );
}
