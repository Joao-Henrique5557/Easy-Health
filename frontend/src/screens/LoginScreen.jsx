import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { authService } from "@/services/authService";
import { getErrorMessage } from "@/utils/apiError";
import { useToast } from "@/components/Toast";
export function LoginScreen({
  onAuthenticated
}) {
  const navigation = useNavigation();
  const {
    showToast
  } = useToast();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    if (!email.trim() || !senha) {
      showToast("Informe seu e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await authService.login({
        email: email.trim().toLowerCase(),
        senha
      });
      onAuthenticated();
    } catch (error) {
      showToast(getErrorMessage(error, "Verifique seu e-mail e senha e tente novamente."));
    } finally {
      setLoading(false);
    }
  }
  return <View style={styles.container}>
    <Text style={styles.title}>Entrar</Text>
    <Text style={styles.subtitle}>Acesse sua conta Easy Health</Text>
    <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!loading} />
    <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry editable={!loading} />
    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}</TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}><Text style={styles.link}>Esqueci minha senha</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Voltar</Text></TouchableOpacity>
  </View>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f7faf8"
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#173b31",
    textAlign: "center"
  },
  subtitle: {
    textAlign: "center",
    color: "#60736c",
    marginBottom: 24
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d8e3df",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12
  },
  button: {
    backgroundColor: "#2f8f70",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  link: {
    textAlign: "center",
    color: "#2f8f70",
    marginTop: 12
  }
});
