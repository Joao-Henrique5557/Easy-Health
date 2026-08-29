import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PillTabs } from "@/components/PillTabs";
import { Pill } from "@/components/Pill";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { historyService } from "@/services/historyService";
import type { ConsultaHistoricoMock } from "@/data/historyMock";
import { formatDateShort } from "@/utils/date";

type Aba = "consultas" | "exames" | "vacinas" | "medicamentos";

const TABS: { value: Aba; label: string }[] = [
  { value: "consultas", label: "Consultas" },
  { value: "exames", label: "Exames" },
  { value: "vacinas", label: "Vacinas" },
  { value: "medicamentos", label: "Medicamentos" },
];

export function HistoryScreen() {
  const navigation = useAppNavigation();
  const [aba, setAba] = useState<Aba>("consultas");
  const [consultas, setConsultas] = useState<ConsultaHistoricoMock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyService.listConsultas().then((data) => {
      setConsultas(data);
      setLoading(false);
    });
  }, []);

  function handleAddRecord() {
    // Fluxo de adicionar registro manual fica para uma fase seguinte
    // (upload de documento / formulário) — placeholder por ora.
    Alert.alert("Em breve", "O formulário de adicionar registro ainda está em desenvolvimento.");
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 100 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 19, color: colors.ink, marginBottom: 16 }}>Meu Histórico</Text>

      <View style={{ marginBottom: 18 }}>
        <PillTabs options={TABS} value={aba} onChange={setAba} />
      </View>

      {aba !== "consultas" ? (
        <Text style={{ fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft }}>
          Nenhum registro de {TABS.find((t) => t.value === aba)?.label.toLowerCase()} ainda.
        </Text>
      ) : loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <View style={{ gap: 10, marginBottom: 20 }}>
          {consultas.map((c) => (
            <View key={c.id} style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
                  {formatDateShort(c.data)}
                </Text>
                <Pill>{c.status === "realizada" ? "Realizada" : "Agendada"}</Pill>
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.ink, marginTop: 6 }}>{c.medico}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>
                {c.especialidade} • {c.local}
              </Text>
              {c.diagnostico && (
                <Pressable onPress={() => navigation.navigate("ConsultationDetail", { id: c.id })} style={{ marginTop: 10 }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary }}>
                    Ver detalhes do diagnóstico →
                  </Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleAddRecord}
        style={{
          backgroundColor: colors.primary,
          borderRadius: radius.md,
          paddingVertical: 14,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 13.5, color: colors.white }}>+ Adicionar Registro</Text>
      </Pressable>
    </ScrollView>
  );
}
