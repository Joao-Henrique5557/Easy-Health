import React from "react";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { Pill } from "./Pill";
import type { Establishment } from "@/services/establishmentsService";

const TIPO_LABEL: Record<Establishment["tipo"], string> = {
  hospital: "Hospital",
  clinica: "Clínica",
  ubs: "UBS",
  upa: "UPA",
  laboratorio: "Laboratório",
};

export function ClinicCard({ item }: { item: Establishment }) {
  return (
    <View style={{ backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 13 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.ink }}>{item.nome}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 2 }}>
            {item.redeAtendimento === "publico" ? "Público" : "Privado"} • {TIPO_LABEL[item.tipo]}
          </Text>
        </View>
        <Pill>{`${item.distanciaKm.toFixed(1)} km`}</Pill>
      </View>
      <View style={{ flexDirection: "row", gap: 14, marginTop: 10 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft }}>
          💰 {item.precoDesde ?? "Gratuito (SUS)"}
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft }}>🕒 {item.horario}</Text>
      </View>
    </View>
  );
}
