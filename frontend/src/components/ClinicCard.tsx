import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";
import { Pill } from "./Pill";
import type { Establishment } from "@/services/establishmentsService";

const TIPO_LABEL: Record<Establishment["tipo"], string> = {
  hospital: "Hospital",
  clinica: "Clínica",
  ubs: "UBS",
  upa: "UPA",
  laboratorio: "Laboratório",
};

interface ClinicCardProps {
  item: Establishment;
  onPress: () => void;
  onPressRoute: () => void;
}

export function ClinicCard({ item, onPress, onPressRoute }: ClinicCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: colors.panel, borderRadius: radius.lg, padding: 14 }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pill>{TIPO_LABEL[item.tipo]}</Pill>
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft }}>
            {item.distanciaKm.toFixed(1)} km
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Ionicons name="star" size={13} color={colors.primary} />
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink }}>
            {item.avaliacao.toFixed(1)}
          </Text>
        </View>
      </View>

      <Text style={{ fontFamily: fonts.bold, fontSize: 14.5, color: colors.ink, marginTop: 8 }}>{item.nome}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft, marginTop: 2 }}>
        {item.endereco}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: colors.line,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: item.status === "aberto" ? colors.primary : colors.alert,
            }}
          />
          <Text style={{ fontFamily: fonts.medium, fontSize: 11.5, color: colors.inkSoft }}>
            {item.status === "aberto" ? "Aberto agora" : item.statusLabel ?? "Fechado"}
          </Text>
        </View>
        <Pressable onPress={onPressRoute} hitSlop={6}>
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary }}>Como chegar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
