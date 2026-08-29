import React from "react";
import { ActivityIndicator, Pressable, Text, View, PressableProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, radius } from "@/theme/typography";

interface BaseProps extends Omit<PressableProps, "style"> {
  label: string;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Botão principal verde (Entrar, Criar conta, Salvar, Confirmar Agendamento...) */
export function PrimaryButton({ label, loading, icon, disabled, ...rest }: BaseProps) {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: pressed || disabled || loading ? 0.85 : 1,
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={17} color={colors.white} />}
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 14.5, color: colors.white }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

/** Botão secundário com borda (Já tenho conta, Como Chegar...) */
export function SecondaryButton({ label, loading, icon, ...rest }: BaseProps) {
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: colors.panel,
        borderWidth: 1.5,
        borderColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: pressed ? 0.8 : 1,
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={17} color={colors.primary} />}
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 14.5, color: colors.primary }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

/** Botão vermelho de ação de emergência (Ligar SAMU) */
export function DangerButton({ label, loading, icon = "call", ...rest }: BaseProps) {
  return (
    <Pressable
      style={({ pressed }) => ({
        backgroundColor: colors.alert,
        borderRadius: radius.md,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: pressed ? 0.9 : 1,
      })}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Ionicons name={icon} size={18} color={colors.white} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.white }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

/** Linha de texto para "Não tem conta? Criar conta" */
export function InlineLink({ prefix, label, onPress }: { prefix?: string; label: string; onPress: () => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}>
      {prefix && <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.inkSoft }}>{prefix}</Text>}
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.primary }}>{label}</Text>
      </Pressable>
    </View>
  );
}
