import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { PrimaryButton } from "@/components/Buttons";
import { ScreenHeader } from "@/components/ScreenHeader";
import { authService } from "@/services/authService";
import { brDateToISO, maskDateInput } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RootStackParamList } from "@/navigation/types";

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
  keyboardType,
  toggleSecure,
  onToggleSecure,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad";
  toggleSecure?: boolean;
  onToggleSecure?: () => void;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>{label}</Text>
      <View style={{ justifyContent: "center" }}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.inkFaint}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={[inputStyle, toggleSecure ? { paddingRight: 44 } : null]}
        />
        {toggleSecure && (
          <Pressable onPress={onToggleSecure} style={{ position: "absolute", right: 14 }} hitSlop={8}>
            <Ionicons name={secure ? "eye-outline" : "eye-off-outline"} size={18} color={colors.inkSoft} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export function RegisterScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert("Preencha os campos", "Nome, e-mail e senha são obrigatórios.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Senha muito curta", "A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert("Senhas diferentes", "A confirmação precisa ser igual à senha criada.");
      return;
    }
    if (!aceitouTermos) {
      Alert.alert("Termos de uso", "Você precisa aceitar os Termos de Uso e Políticas para continuar.");
      return;
    }

    let dataNascimentoISO: string | undefined;
    if (dataNascimento) {
      const converted = brDateToISO(dataNascimento);
      if (!converted) {
        Alert.alert("Data inválida", "Digite a data de nascimento no formato DD/MM/AAAA.");
        return;
      }
      dataNascimentoISO = converted;
    }

    setLoading(true);
    try {
      await authService.register({
        nome,
        email,
        telefone,
        senha,
        dataNascimento: dataNascimentoISO,
      });
      onAuthenticated();
    } catch (error) {
      Alert.alert("Não foi possível cadastrar", getApiErrorMessage(error, "Verifique os dados e tente novamente."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Criar Conta" onBack={() => navigation.goBack()} />

        <Field label="Nome completo" placeholder="Ex: Maria Silva" value={nome} onChangeText={setNome} />
        <Field label="E-mail" placeholder="exemplo@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field label="Telefone" placeholder="(11) 99999-9999" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <Field
          label="Data de nascimento"
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChangeText={(v) => setDataNascimento(maskDateInput(v))}
          keyboardType="number-pad"
        />
        <Field
          label="Senha"
          placeholder="Crie uma senha forte"
          value={senha}
          onChangeText={setSenha}
          secure={!showSenha}
          toggleSecure
          onToggleSecure={() => setShowSenha((v) => !v)}
        />
        <Field
          label="Confirmar senha"
          placeholder="Repita a senha criada"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secure={!showConfirmar}
          toggleSecure
          onToggleSecure={() => setShowConfirmar((v) => !v)}
        />

        <Pressable
          onPress={() => setAceitouTermos((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 22 }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              borderWidth: aceitouTermos ? 0 : 1.5,
              borderColor: colors.line,
              backgroundColor: aceitouTermos ? colors.primary : colors.panel,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {aceitouTermos && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </View>
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft, flex: 1 }}>
            Li e aceito os <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>Termos de Uso</Text> e{" "}
            <Text style={{ color: colors.primary, fontFamily: fonts.semiBold }}>Políticas</Text>
          </Text>
        </Pressable>

        <PrimaryButton label="Criar conta" loading={loading} onPress={handleRegister} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
