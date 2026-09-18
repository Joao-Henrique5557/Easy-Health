import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { PrimaryButton, InlineLink } from "@/components/Buttons";
import { ScreenHeader } from "@/components/ScreenHeader";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RootStackParamList } from "@/navigation/types";

interface RegisterScreenProps {
  onAuthenticated: () => void;
}

export function RegisterScreen({ onAuthenticated }: RegisterScreenProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert("Preencha os campos", "Nome, e-mail e senha são obrigatórios.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Senha muito curta", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("As senhas não coincidem", "Verifique a confirmação de senha.");
      return;
    }
    if (!aceitouTermos) {
      Alert.alert("Termos de uso", "Você precisa aceitar os termos de uso para continuar.");
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
        telefone: telefone.trim() || undefined,
      });
      onAuthenticated();
    } catch (error) {
      Alert.alert("Não foi possível criar a conta", getApiErrorMessage(error, "Verifique os dados e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: spacing.lg, paddingTop: spacing.xl }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Criar Conta" onBack={() => navigation.goBack()} />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Nome completo</Text>
        <TextInput
          placeholder="Seu nome"
          placeholderTextColor={colors.inkFaint}
          value={nome}
          onChangeText={setNome}
          editable={!loading}
          style={[inputStyle, { marginBottom: 14 }]}
        />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>E-mail</Text>
        <TextInput
          placeholder="exemplo@email.com"
          placeholderTextColor={colors.inkFaint}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
          style={[inputStyle, { marginBottom: 14 }]}
        />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Telefone (opcional)</Text>
        <TextInput
          placeholder="(00) 00000-0000"
          placeholderTextColor={colors.inkFaint}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
          editable={!loading}
          style={[inputStyle, { marginBottom: 14 }]}
        />

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Senha</Text>
        <View style={{ position: "relative", justifyContent: "center", marginBottom: 14 }}>
          <TextInput
            placeholder="Mínimo 6 caracteres"
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

        <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>Confirmar senha</Text>
        <TextInput
          placeholder="Repita a senha"
          placeholderTextColor={colors.inkFaint}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={!showPassword}
          editable={!loading}
          style={[inputStyle, { marginBottom: 18 }]}
        />

        <Pressable
          onPress={() => setAceitouTermos((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 22 }}
          hitSlop={6}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              borderWidth: 1.5,
              borderColor: aceitouTermos ? colors.primary : colors.line,
              backgroundColor: aceitouTermos ? colors.primary : colors.panel,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {aceitouTermos && <Ionicons name="checkmark" size={13} color={colors.white} />}
          </View>
          <Text style={{ flex: 1, fontFamily: fonts.regular, fontSize: 12.5, color: colors.inkSoft, lineHeight: 17 }}>
            Li e aceito os Termos de Uso e a Política de Privacidade
          </Text>
        </Pressable>

        <PrimaryButton label="Criar conta" loading={loading} onPress={handleRegister} />

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 10 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          <Text style={{ fontFamily: fonts.regular, fontSize: 11.5, color: colors.inkFaint }}>ou continue com</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <Pressable
            onPress={() => Alert.alert("Entrar com Google", "Ainda não disponível — em breve.")}
            style={{ flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: 12 }}
          >
            <Ionicons name="logo-google" size={17} color={colors.ink} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>Google</Text>
          </Pressable>
          <Pressable
            onPress={() => Alert.alert("Entrar com Apple", "Ainda não disponível — em breve.")}
            style={{ flex: 1, flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: 12 }}
          >
            <Ionicons name="logo-apple" size={18} color={colors.ink} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.ink }}>Apple</Text>
          </Pressable>
        </View>

        <InlineLink prefix="Já tem conta?" label="Entrar" onPress={() => navigation.goBack()} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
