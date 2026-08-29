import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { PrimaryButton, InlineLink } from "@/components/Buttons";
import { ScreenHeader } from "@/components/ScreenHeader";
import { authService } from "@/services/authService";
import type { RootStackParamList } from "@/navigation/types";
import { inputStyle } from "@/theme/inputStyle";

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!email) {
      Alert.alert("Digite seu e-mail", "Informe o e-mail cadastrado para receber o link.");
      return;
    }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      Alert.alert("Link enviado", "Verifique seu e-mail para redefinir sua senha.");
      navigation.goBack();
    } catch {
      Alert.alert("Não foi possível enviar", "Verifique o e-mail informado e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: spacing.xl }}
    >
      <ScreenHeader title="Recuperar Senha" onBack={() => navigation.goBack()} />

      <View style={{ alignItems: "center", marginTop: 12, marginBottom: 28 }}>
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Ionicons name="heart" size={24} color={colors.primary} />
        </View>
        <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.inkSoft, textAlign: "center", lineHeight: 19 }}>
          Digite seu e-mail cadastrado para receber um link de recuperação de senha.
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>E-mail</Text>
      <TextInput
        placeholder="exemplo@email.com"
        placeholderTextColor={colors.inkFaint}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={[inputStyle, { marginBottom: 20 }]}
      />

      <PrimaryButton label="Enviar Link" loading={loading} onPress={handleSend} />

      <View style={{ marginTop: 18 }}>
        <InlineLink label="Voltar ao login" onPress={() => navigation.goBack()} />
      </View>
    </KeyboardAvoidingView>
  );
}
