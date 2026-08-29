import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Pill } from "@/components/Pill";
import { Avatar } from "@/components/Avatar";
import { SecondaryButton } from "@/components/Buttons";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { historyService } from "@/services/historyService";
import type { ConsultaHistoricoMock } from "@/data/historyMock";
import { formatDateLong } from "@/utils/date";
import type { RootStackParamList } from "@/navigation/types";

export function ConsultationDetailScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ConsultationDetail">>();
  const [consulta, setConsulta] = useState<ConsultaHistoricoMock | null>(null);

  useEffect(() => {
    historyService.getConsultaById(route.params.id).then((data) => setConsulta(data ?? null));
  }, [route.params.id]);

  function handleDownloadPdf() {
    // Geração real de PDF fica para o backend (rota de histórico/documentos);
    // aqui é só o placeholder visual do botão.
    Alert.alert("Em breve", "O download da receita em PDF ainda está em desenvolvimento.");
  }

  if (!consulta) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }}>
      <ScreenHeader title="Detalhes da Consulta" onBack={() => navigation.goBack()} />

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, marginBottom: 14 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 10.5, color: colors.inkSoft, textTransform: "uppercase" }}>
            Data da Consulta
          </Text>
          <Pill>{consulta.status === "realizada" ? "Realizada" : "Agendada"}</Pill>
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink, textTransform: "capitalize" }}>
          {formatDateLong(consulta.data)}
        </Text>
      </View>

      <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Avatar size={40} />
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink }}>{consulta.medico}</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
            {consulta.especialidade} • {consulta.local}
          </Text>
        </View>
      </View>

      {consulta.diagnostico && (
        <View style={{ backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark, textTransform: "uppercase", marginBottom: 4 }}>
            Diagnóstico
          </Text>
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 13.5, color: colors.ink, marginBottom: 4 }}>
            {consulta.diagnostico}
          </Text>
          {consulta.observacoes && (
            <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft, lineHeight: 18 }}>
              {consulta.observacoes}
            </Text>
          )}
        </View>
      )}

      {consulta.prescricoes && consulta.prescricoes.length > 0 && (
        <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark, textTransform: "uppercase", marginBottom: 10 }}>
            Prescrições
          </Text>
          <View style={{ gap: 10 }}>
            {consulta.prescricoes.map((p) => (
              <View key={p.medicamento} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                <Ionicons name="medkit-outline" size={15} color={colors.primary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink }}>{p.medicamento}</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>{p.posologia}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {consulta.retorno && (
        <View style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14, marginBottom: 22 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark, textTransform: "uppercase", marginBottom: 4 }}>
            Retorno Recomendado
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>{consulta.retorno}</Text>
        </View>
      )}

      <SecondaryButton label="Baixar Receita (PDF)" icon="download-outline" onPress={handleDownloadPdf} />
    </ScrollView>
  );
}
