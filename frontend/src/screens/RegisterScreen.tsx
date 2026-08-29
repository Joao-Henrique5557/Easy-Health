import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { authService } from "@/services/authService";

export function RegisterScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const navigation = useNavigation();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", senha: "", dataNascimento: "" });
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!form.nome || !form.email || !form.senha) {
      Alert.alert("Preencha os campos", "Nome, e-mail e senha são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      await authService.register(form);
      onAuthenticated();
    } catch {
      Alert.alert("Não foi possível cadastrar", "Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, justifyContent: "center", flexGrow: 1 }}>
        <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
          Easy Health
        </Text>
        <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.ink, marginTop: 4, marginBottom: 24 }}>
          Criar conta
        </Text>

        <TextInput placeholder="Nome completo" placeholderTextColor={colors.inkSoft} value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} style={inputStyle} />
        <TextInput placeholder="E-mail" placeholderTextColor={colors.inkSoft} value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} autoCapitalize="none" keyboardType="email-address" style={inputStyle} />
        <TextInput placeholder="Telefone" placeholderTextColor={colors.inkSoft} value={form.telefone} onChangeText={(v) => setForm({ ...form, telefone: v })} keyboardType="phone-pad" style={inputStyle} />
        <TextInput placeholder="Data de nascimento (AAAA-MM-DD)" placeholderTextColor={colors.inkSoft} value={form.dataNascimento} onChangeText={(v) => setForm({ ...form, dataNascimento: v })} style={inputStyle} />
        <TextInput placeholder="Senha" placeholderTextColor={colors.inkSoft} value={form.senha} onChangeText={(v) => setForm({ ...form, senha: v })} secureTextEntry style={inputStyle} />

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 14, color: colors.white }}>
            {loading ? "Criando conta..." : "Criar conta"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.primaryDark }}>
            Já tem conta? Entrar
          </Text>
        </Pressable>
      </ScrollView>
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
