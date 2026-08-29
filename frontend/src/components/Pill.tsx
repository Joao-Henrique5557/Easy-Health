import React from "react";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";

interface PillProps {
  children: string;
  tone?: "primary" | "alert" | "neutral";
}

/** Badge pequeno usado em tipo de estabelecimento, status "Realizada" etc. */
export function Pill({ children, tone = "primary" }: PillProps) {
  const map = {
    primary: { bg: colors.primarySoft, fg: colors.primaryDark },
    alert: { bg: colors.alertSoft, fg: colors.alertDark },
    neutral: { bg: colors.line, fg: colors.inkSoft },
  };
  const c = map[tone];

  return (
    <View
      style={{
        backgroundColor: c.bg,
        borderRadius: radius.pill,
        paddingHorizontal: 9,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 11, color: c.fg, letterSpacing: 0.2 }}>{children}</Text>
    </View>
  );
}
