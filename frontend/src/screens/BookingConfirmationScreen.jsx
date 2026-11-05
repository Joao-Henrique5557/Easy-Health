import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { AppAlert as Alert } from "@/services/appAlert";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { bookingService } from "@/services/bookingService";
import { calendarService } from "@/services/calendarService";
import { formatDateLong } from "@/utils/date";
export function BookingConfirmationScreen() {
  const navigation = useAppNavigation();
  const route = useRoute();
  const [booking, setBooking] = useState(null);
  const [busy, setBusy] = useState(null);
  useEffect(() => {
    let active = true;
    bookingService.getById(route.params.bookingId)
      .then(data => {
        if (active) setBooking(data);
      })
      .catch(error => {
        Alert.alert("Não foi possível carregar a consulta", error.message || "Tente novamente.");
        if (active) navigation.goBack();
      });
    return () => {
      active = false;
    };
  }, [navigation, route.params.bookingId]);
  async function handleAddToCalendar() {
    if (!booking || busy) return;
    setBusy("calendar");
    try {
      await calendarService.addBooking(booking);
      Alert.alert(
        "Consulta adicionada",
        Platform.OS === "web"
          ? "O arquivo do calendário foi baixado. Abra-o para importar a consulta."
          : "O evento foi adicionado ao calendário do dispositivo."
      );
    } catch (error) {
      Alert.alert("Não foi possível adicionar ao calendário", error.message || "Tente novamente.");
    } finally {
      setBusy(null);
    }
  }
  if (!booking) {
    return <View style={{
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: "center",
      justifyContent: "center"
    }}>
        <ActivityIndicator color={colors.primary} />
      </View>;
  }
  return <View style={{
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
    paddingTop: spacing.xxl
  }}>
      <View style={{
      alignItems: "center",
      marginBottom: 24
    }}>
        <View style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primarySoft,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16
      }}>
          <Ionicons name="checkmark" size={30} color={colors.primary} />
        </View>
        <Text style={{
        fontFamily: fonts.extraBold,
        fontSize: 19,
        color: colors.ink
      }}>Consulta Agendada!</Text>
        <Text style={{
        fontFamily: fonts.regular,
        fontSize: 12.5,
        color: colors.inkSoft,
        textAlign: "center",
        marginTop: 6,
        lineHeight: 18
      }}>
          Seu agendamento foi confirmado. Apresente seu documento na recepção.
        </Text>
      </View>

      <View style={{
      backgroundColor: colors.panel,
      borderRadius: radius.lg,
      padding: 16,
      marginBottom: 28
    }}>
        <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 14
      }}>
          <View style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center"
        }}>
            <Ionicons name="person" size={17} color={colors.primary} />
          </View>
          <View>
            <Text style={{
            fontFamily: fonts.bold,
            fontSize: 13.5,
            color: colors.ink
          }}>{booking.medico}</Text>
            <Text style={{
            fontFamily: fonts.regular,
            fontSize: 11.5,
            color: colors.inkSoft
          }}>
              {booking.especialidade} • {booking.medicoCrm}
            </Text>
          </View>
        </View>

        <View style={{
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.line
      }}>
          <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}>
            <Ionicons name="calendar-outline" size={15} color={colors.inkSoft} />
            <Text style={{
            fontFamily: fonts.medium,
            fontSize: 12.5,
            color: colors.ink,
            textTransform: "capitalize"
          }}>
              {formatDateLong(booking.data)}
            </Text>
          </View>
          <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}>
            <Ionicons name="time-outline" size={15} color={colors.inkSoft} />
            <Text style={{
            fontFamily: fonts.medium,
            fontSize: 12.5,
            color: colors.ink
          }}>Horário: {booking.horario}</Text>
          </View>
          <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}>
            <Ionicons name="location-outline" size={15} color={colors.inkSoft} />
            <Text style={{
            fontFamily: fonts.medium,
            fontSize: 12.5,
            color: colors.ink
          }}>{booking.establishmentNome}</Text>
          </View>
        </View>

        <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: colors.line
      }}>
          <Text style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          color: colors.inkSoft
        }}>Valor do Atendimento</Text>
          <Text style={{
          fontFamily: fonts.extraBold,
          fontSize: 16,
          color: colors.primary
        }}>{booking.valor}</Text>
        </View>
      </View>

      <View style={{
      gap: 10
    }}>
        <PrimaryButton label="Voltar ao Início" onPress={() => navigation.navigate("MainTabs")} />
        <SecondaryButton label="Adicionar ao Calendário" icon="calendar-outline" loading={busy === "calendar"} onPress={handleAddToCalendar} />
      </View>
    </View>;
}
