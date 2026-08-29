import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { api } from "@/services/api";
import { authService } from "@/services/authService";

interface ProfileForm {
  nome: string;
  email: string;
  telefone: string;
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 11.5, color: colors.inkSoft }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        style={{
          marginTop: 4,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.ink,
        }}
      />
    </View>
  );
}

export function ProfileScreen() {
  const [form, setForm] = useState<ProfileForm>({ nome: "", email: "", telefone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // GET /api/users/me — rota 21.2 do readme
    api
      .get("/api/users/me")
      .then(({ data }) => setForm({ nome: data.nome ?? "", email: data.email ?? "", telefone: data.telefone ?? "" }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/api/users/me", form);
      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar suas alterações agora.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await authService.logout();
    // A navegação para a tela de Login deve ser tratada pelo listener de
    // autenticação no RootNavigator (ver App.tsx), que observa o token.
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Cadastro
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4, marginBottom: 16 }}>
        Meu Perfil
      </Text>

      {!loading && (
        <>
          <Field label="Nome completo" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />
          <Field label="E-mail" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address" />
          <Field label="Telefone" value={form.telefone} onChangeText={(v) => setForm({ ...form, telefone: v })} keyboardType="phone-pad" />

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 13,
              alignItems: "center",
              marginTop: 8,
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.white }}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={{ alignItems: "center", marginTop: 16 }}>
            <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13, color: colors.alertDark }}>Sair da conta</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
