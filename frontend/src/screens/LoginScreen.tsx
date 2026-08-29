import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { authService } from "@/services/authService";
import type { RootStackParamList } from "@/navigation/types";

export function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Preencha os campos", "E-mail e senha são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      await authService.login({ email, senha });
      onAuthenticated();
    } catch {
      Alert.alert("Não foi possível entrar", "Verifique seu e-mail e senha e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: spacing.xl }}
    >
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Easy Health
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.ink, marginTop: 4, marginBottom: 24 }}>
        Bem-vindo de volta
      </Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor={colors.inkSoft}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor={colors.inkSoft}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={inputStyle}
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
      >
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.white }}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Register")} style={{ alignItems: "center", marginTop: 16 }}>
        <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.primaryDark }}>
          Não tem conta? Cadastre-se
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: colors.line,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontFamily: fonts.body,
  fontSize: 13.5,
  color: colors.ink,
  marginBottom: 12,
  backgroundColor: colors.panel,
} as const;
