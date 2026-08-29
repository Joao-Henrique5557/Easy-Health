import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

interface TileProps {
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function Tile({ label, desc, icon, onPress }: TileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexBasis: "48%",
        backgroundColor: colors.panel,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 16,
        padding: 14,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.ink, marginTop: 10 }}>
        {label}
      </Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 3 }}>
        {desc}
      </Text>
    </Pressable>
  );
}
