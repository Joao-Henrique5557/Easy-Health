import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Pill } from "@/components/Pill";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/Buttons";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { establishmentsService, Establishment } from "@/services/establishmentsService";
import { bookingService } from "@/services/bookingService";
import { getMonthGrid, getWeekdayLabels, getMonthLabel } from "@/utils/calendar";
import type { RootStackParamList } from "@/navigation/types";

const DOCTOR_PREVIEW = { nome: "Dr. Carlos Mendes", crm: "CRM 12345", valor: "R$ 280" };

export function BookingScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "Booking">>();
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [especialidade, setEspecialidade] = useState<string>("");
  const [showEspecialidades, setShowEspecialidades] = useState(false);
  const [monthRef, setMonthRef] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [horarios, setHorarios] = useState<string[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const grid = useMemo(() => getMonthGrid(monthRef), [monthRef]);
  const weekdayLabels = getWeekdayLabels();

  useEffect(() => {
    establishmentsService.getById(route.params.establishmentId).then((data) => {
      setEstablishment(data ?? null);
      setEspecialidade(data?.especialidades?.[0] ?? "Clínica Geral");
    });
  }, [route.params.establishmentId]);

  useEffect(() => {
    establishmentsService.getHorariosDisponiveis(route.params.establishmentId, selectedDate).then((data) => {
      setHorarios(data);
      setSelectedHorario(null);
    });
  }, [route.params.establishmentId, selectedDate]);

  async function handleConfirm() {
    if (!selectedHorario) {
      Alert.alert("Escolha um horário", "Selecione um horário disponível para continuar.");
      return;
    }
    setSubmitting(true);
    try {
      const booking = await bookingService.create({
        establishmentId: route.params.establishmentId,
        especialidade,
        data: selectedDate,
        horario: selectedHorario,
      });
      navigation.navigate("BookingConfirmation", { bookingId: booking.id });
    } catch {
      Alert.alert("Não foi possível agendar", "Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!establishment) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const especialidadesDisponiveis = establishment.especialidades ?? ["Clínica Geral"];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }}>
      <ScreenHeader title="Agendar Consulta" onBack={() => navigation.goBack()} />

      <View style={{ marginBottom: 16 }}>
        <Pill>Estabelecimento</Pill>
        <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.ink, marginTop: 6 }}>
          {establishment.nome}
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.ink, marginBottom: 6 }}>
        Especialidade
      </Text>
      <Pressable
        onPress={() => setShowEspecialidades((v) => !v)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.panel,
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.line,
          paddingHorizontal: 14,
          paddingVertical: 13,
          marginBottom: showEspecialidades ? 4 : 18,
        }}
      >
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{especialidade}</Text>
        <Ionicons name={showEspecialidades ? "chevron-up" : "chevron-down"} size={16} color={colors.inkSoft} />
      </Pressable>
      {showEspecialidades && (
        <View style={{ backgroundColor: colors.panel, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, marginBottom: 18, overflow: "hidden" }}>
          {especialidadesDisponiveis.map((esp) => (
            <Pressable
              key={esp}
              onPress={() => {
                setEspecialidade(esp);
                setShowEspecialidades(false);
              }}
              style={{ paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line }}
            >
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.ink }}>{esp}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.ink }}>Selecione a Data</Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.inkSoft, textTransform: "capitalize" }}>
          {getMonthLabel(monthRef)}
        </Text>
      </View>

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 12, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Pressable onPress={() => setMonthRef(new Date(monthRef.getFullYear(), monthRef.getMonth() - 1, 1))} hitSlop={8}>
            <Ionicons name="chevron-back" size={16} color={colors.inkSoft} />
          </Pressable>
          <Pressable onPress={() => setMonthRef(new Date(monthRef.getFullYear(), monthRef.getMonth() + 1, 1))} hitSlop={8}>
            <Ionicons name="chevron-forward" size={16} color={colors.inkSoft} />
          </Pressable>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 6 }}>
          {weekdayLabels.map((w, i) => (
            <Text key={i} style={{ flex: 1, textAlign: "center", fontFamily: fonts.semiBold, fontSize: 10.5, color: colors.inkFaint }}>
              {w}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {grid.map((d) => {
            const isSelected = d.iso === selectedDate;
            return (
              <Pressable
                key={d.iso}
                onPress={() => d.inCurrentMonth && setSelectedDate(d.iso)}
                disabled={!d.inCurrentMonth}
                style={{
                  width: `${100 / 7}%`,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? colors.primary : "transparent",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: isSelected ? fonts.bold : fonts.regular,
                      fontSize: 12.5,
                      color: !d.inCurrentMonth ? colors.inkFaint : isSelected ? colors.white : colors.ink,
                    }}
                  >
                    {d.day}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.ink, marginBottom: 10 }}>
        Horários Disponíveis
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {horarios.map((h) => {
          const active = h === selectedHorario;
          return (
            <Pressable
              key={h}
              onPress={() => setSelectedHorario(h)}
              style={{
                borderRadius: radius.pill,
                paddingHorizontal: 14,
                paddingVertical: 9,
                backgroundColor: active ? colors.primary : colors.panel,
                borderWidth: active ? 0 : 1,
                borderColor: colors.line,
              }}
            >
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: active ? colors.white : colors.ink }}>
                {h}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: colors.panel,
          borderRadius: radius.lg,
          padding: 13,
          marginBottom: 22,
        }}
      >
        <Avatar size={40} />
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.ink }}>{DOCTOR_PREVIEW.nome}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
            {especialidade} • {DOCTOR_PREVIEW.crm}
          </Text>
        </View>
        <Text style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 13.5, color: colors.primary }}>
          {DOCTOR_PREVIEW.valor}
        </Text>
      </View>

      <PrimaryButton label="Confirmar Agendamento" loading={submitting} onPress={handleConfirm} />
    </ScrollView>
  );
}
