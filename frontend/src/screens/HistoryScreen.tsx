import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { Pill } from "@/components/Pill";
import { historyService, ConsultaHistorico, ExameHistorico } from "@/services/historyService";

type HistoryItem = ConsultaHistorico | ExameHistorico;

export function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([historyService.listConsultas(), historyService.listExames()])
      .then(([consultas, exames]) => {
        const merged = [...consultas, ...exames].sort(
          (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
        );
        setItems(merged);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Organização
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4, marginBottom: 16 }}>
        Meu Histórico
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: colors.panel,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 14,
                padding: 13,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Pill>{item.tipo === "consulta" ? "Consulta" : "Exame"}</Pill>
                <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.ink, marginTop: 6 }}>
                  {item.descricao}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft }}>
                {new Date(item.data).toLocaleDateString("pt-BR")}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.inkSoft }}>
              Nenhum registro por aqui ainda.
            </Text>
          }
        />
      )}
    </View>
  );
}
