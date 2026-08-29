import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";

interface TileProps {
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

/** Card de atalho 2x2 usado em "Serviços Integrados" na Home. */
export function Tile({ label, desc, icon, onPress }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexBasis: "48%",
        backgroundColor: colors.panel,
        borderRadius: radius.lg,
        padding: 16,
        opacity: pressed ? 0.85 : 1,
        shadowColor: "#0F172A",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 1,
      })}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: radius.md,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 13.5, color: colors.ink }}>{label}</Text>
      <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkSoft, marginTop: 3 }}>{desc}</Text>
    </Pressable>
  );
}
