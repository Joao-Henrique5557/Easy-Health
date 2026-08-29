import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPressRight?: () => void;
  rightActive?: boolean;
  dark?: boolean;
}

/** Cabeçalho padrão "< Título" usado em quase todas as telas internas. */
export function ScreenHeader({ title, onBack, rightIcon, onPressRight, rightActive, dark }: ScreenHeaderProps) {
  const fg = dark ? colors.white : colors.ink;
  const accent = dark ? colors.white : colors.primary;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, minHeight: 28 }}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={10} style={{ width: 32 }}>
          <Ionicons name="chevron-back" size={22} color={accent} />
        </Pressable>
      ) : (
        <View style={{ width: 32 }} />
      )}
      <Text style={{ flex: 1, textAlign: "center", fontFamily: fonts.bold, fontSize: 16.5, color: fg }}>
        {title}
      </Text>
      {rightIcon ? (
        <Pressable onPress={onPressRight} hitSlop={10} style={{ width: 32, alignItems: "flex-end" }}>
          <Ionicons name={rightIcon} size={21} color={rightActive ? colors.alert : accent} />
        </Pressable>
      ) : (
        <View style={{ width: 32 }} />
      )}
    </View>
  );
}
