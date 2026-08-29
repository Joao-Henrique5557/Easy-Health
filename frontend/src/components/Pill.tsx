import React from "react";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";

interface PillProps {
  children: string;
  tone?: "primary" | "alert";
}

export function Pill({ children, tone = "primary" }: PillProps) {
  const bg = tone === "primary" ? colors.primarySoft : colors.alertSoft;
  const fg = tone === "primary" ? colors.primaryDark : colors.alertDark;

  return (
    <View style={{ backgroundColor: bg, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, alignSelf: "flex-start" }}>
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 11, color: fg, letterSpacing: 0.2 }}>
        {children}
      </Text>
    </View>
  );
}
