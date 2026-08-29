import React from "react";
import { ScrollView, Pressable, Text } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";

interface PillTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

/** Fileira de filtros/abas em formato pílula — usado em Busca e Histórico. */
export function PillTabs<T extends string>({ options, value, onChange }: PillTabsProps<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 9,
              borderRadius: radius.pill,
              backgroundColor: active ? colors.primary : colors.panel,
              borderWidth: active ? 0 : 1,
              borderColor: colors.line,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 12.5,
                color: active ? colors.white : colors.inkSoft,
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
