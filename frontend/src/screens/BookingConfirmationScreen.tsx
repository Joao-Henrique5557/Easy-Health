import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { bookingService, Booking } from "@/services/bookingService";
import { formatDateLong } from "@/utils/date";
import type { RootStackParamList } from "@/navigation/types";

export function BookingConfirmationScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "BookingConfirmation">>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    bookingService.listUpcoming().then((list) => {
      setBooking(list.find((b) => b.id === route.params.bookingId) ?? list[0] ?? null);
    });
  }, [route.params.bookingId]);

  function handleAddToCalendar() {
    // Integração real usaria expo-calendar (API nativa do Android/iOS) com
    // permissão de calendário — deixado como próximo passo do backlog.
    Alert.alert("Em breve", "Adicionar ao calendário do sistema será implementado com expo-calendar.");
  }

  if (!booking) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xxl }}>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="checkmark" size={30} color={colors.primary} />
        </View>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 19, color: colors.ink }}>Consulta Agendada!</Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, textAlign: "center", marginTop: 6, lineHeight: 18 }}>
          Seu agendamento foi confirmado. Apresente seu documento na recepção.
        </Text>
      </View>

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 16, marginBottom: 28 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="person" size={17} color={colors.primary} />
          </View>
          <View>
            <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink }}>{booking.medico}</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
              {booking.especialidade} • {booking.medicoCrm}
            </Text>
          </View>
        </View>

        <View style={{ gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="calendar-outline" size={15} color={colors.inkSoft} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink, textTransform: "capitalize" }}>
              {formatDateLong(booking.data)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="time-outline" size={15} color={colors.inkSoft} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink }}>Horário: {booking.horario}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="location-outline" size={15} color={colors.inkSoft} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.ink }}>{booking.establishmentNome}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line }}>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft }}>Valor do Atendimento</Text>
          <Text style={{ fontFamily: fonts.extraBold, fontSize: 16, color: colors.primary }}>{booking.valor}</Text>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <PrimaryButton label="Voltar ao Início" onPress={() => navigation.navigate("MainTabs")} />
        <SecondaryButton label="Adicionar ao Calendário" icon="calendar-outline" onPress={handleAddToCalendar} />
      </View>
    </View>
  );
}
