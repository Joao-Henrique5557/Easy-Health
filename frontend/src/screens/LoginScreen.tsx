import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { PrimaryButton, InlineLink } from "@/components/Buttons";
import { ScreenHeader } from "@/components/ScreenHeader";
import { authService } from "@/services/authService";
import type { RootStackParamList } from "@/navigation/types";

export function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  function handleSocialLogin(provider: "Google" | "Apple") {
    // Login social é um trabalho de backend separado (OAuth) — deixado
    // como placeholder visual até a integração real ser implementada.
    Alert.alert("Em breve", `Login com ${provider} ainda não está disponível nesta versão.`);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Acessar Conta" onBack={() => navigation.goBack()} />

        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: colors.primarySoft,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <Ionicons name="heart" size={24} color={colors.primary} />
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.ink }}>Seja bem-vindo de volta!</Text>
        </View>

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>E-mail</Text>
        <TextInput
          placeholder="maria.silva@email.com"
          placeholderTextColor={colors.inkFaint}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[inputStyle, { marginBottom: 14 }]}
        />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Senha</Text>
        <View style={{ position: "relative", justifyContent: "center", marginBottom: 8 }}>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={colors.inkFaint}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            style={[inputStyle, { paddingRight: 44 }]}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} style={{ position: "absolute", right: 14 }} hitSlop={8}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={colors.inkSoft} />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={{ alignSelf: "flex-end", marginBottom: 20 }}>
          <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary }}>Esqueci minha senha</Text>
        </Pressable>

        <PrimaryButton label="Entrar" loading={loading} onPress={handleLogin} />

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkFaint }}>ou entre com</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
        </View>

        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          <Pressable
            onPress={() => handleSocialLogin("Google")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: colors.panel,
            }}
          >
            <Ionicons name="logo-google" size={16} color={colors.ink} />
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink }}>Google</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSocialLogin("Apple")}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: colors.panel,
            }}
          >
            <Ionicons name="logo-apple" size={17} color={colors.ink} />
            <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.ink }}>Apple</Text>
          </Pressable>
        </View>

        <InlineLink prefix="Não tem conta?" label="Criar conta" onPress={() => navigation.navigate("Register")} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
