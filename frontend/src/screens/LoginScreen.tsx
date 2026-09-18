import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { PrimaryButton, InlineLink } from "@/components/Buttons";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RootStackParamList } from "@/navigation/types";

interface LoginScreenProps {
  onAuthenticated: () => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert("Preencha os campos", "Informe seu e-mail e senha para entrar.");
      return;
    }

    setLoading(true);
    try {
      await authService.login({ email: email.trim().toLowerCase(), senha });
      onAuthenticated();
    } catch (error) {
      Alert.alert("Não foi possível entrar", getApiErrorMessage(error, "Verifique seu e-mail e senha e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider: "Google" | "Apple") {
    Alert.alert(`Entrar com ${provider}`, "Ainda não disponível — em breve.");
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.xl, justifyContent: "center" }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="heart" size={32} color={colors.primary} />
        </View>

        <Text style={{ fontFamily: fonts.extraBold, fontSize: 22, color: colors.ink, textAlign: "center" }}>
          Bem-vindo de volta
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.inkSoft, textAlign: "center", marginTop: 4, marginBottom: 28 }}>
          Entre na sua conta para continuar
        </Text>

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>E-mail</Text>
        <TextInput
          placeholder="exemplo@email.com"
          placeholderTextColor={colors.inkFaint}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          style={[inputStyle, { marginBottom: 16 }]}
        />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Senha</Text>
        <View style={{ position: "relative", justifyContent: "center", marginBottom: 8 }}>
          <TextInput
            placeholder="••••••••"
            placeholderTextColor={colors.inkFaint}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPassword}
            editable={!loading}
            style={[inputStyle, { paddingRight: 44 }]}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10} style={{ position: "absolute", right: 14 }}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color={colors.inkFaint} />
          </Pressable>
        </View>

        <Pressable onPress={() => navigation.navigate("ForgotPassword")} hitSlop={8} style={{ alignSelf: "flex-end", marginBottom: 22 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.primary }}>Esqueci minha senha</Text>
        </Pressable>

        <PrimaryButton label="Entrar" loading={loading} onPress={handleLogin} />

        <Pressable
          onPress={onAuthenticated}
          hitSlop={8}
          style={{ alignSelf: "center", marginTop: 14 }}
        >
          <Text style={{ fontFamily: fonts.medium, fontSize: 12.5, color: colors.inkSoft, textDecorationLine: "underline" }}>
            Continuar sem conta
          </Text>
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkFaint }}>ou continue com</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <Pressable
            onPress={() => handleSocialLogin("Google")}
            style={{ flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: 12 }}
          >
            <Ionicons name="logo-google" size={17} color={colors.ink} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>Google</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSocialLogin("Apple")}
            style={{ flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: 12 }}
          >
            <Ionicons name="logo-apple" size={18} color={colors.ink} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>Apple</Text>
          </Pressable>
        </View>

        <InlineLink prefix="Não tem conta?" label="Criar conta" onPress={() => navigation.navigate("Register")} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
