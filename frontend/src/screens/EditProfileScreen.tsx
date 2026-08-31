import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/Buttons";
import { profileService, UserProfile } from "@/services/profileService";
import { isoDateToBR, brDateToISO, maskDateInput } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/apiError";
import type { RootStackParamList } from "@/navigation/types";

function Field({ label, value, onChangeText, keyboardType }: { label: string; value: string; onChangeText: (v: string) => void; keyboardType?: "default" | "email-address" | "phone-pad" | "number-pad" }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 12, color: colors.ink, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} style={inputStyle} />
    </View>
  );
}

export function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    tipoSanguineo: "",
    alergias: "",
    medicamentosEmUso: "",
    planoDeSaude: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    profileService.getMe().then((p: UserProfile) => {
      setForm({
        nome: p.nome ?? "",
        email: p.email ?? "",
        telefone: p.telefone ?? "",
        dataNascimento: p.dataNascimento ? isoDateToBR(p.dataNascimento) : "",
        tipoSanguineo: p.tipoSanguineo ?? "",
        alergias: p.alergias ?? "",
        medicamentosEmUso: p.medicamentosEmUso ?? "",
        planoDeSaude: p.planoDeSaude ?? "",
      });
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    let dataNascimentoISO: string | undefined;
    if (form.dataNascimento) {
      const converted = brDateToISO(form.dataNascimento);
      if (!converted) {
        Alert.alert("Data inválida", "Digite a data de nascimento no formato DD/MM/AAAA.");
        return;
      }
      dataNascimentoISO = converted;
    }

    setSaving(true);
    try {
      await profileService.updateMe({
        ...form,
        dataNascimento: dataNascimentoISO,
      });
      Alert.alert("Perfil atualizado", "Seus dados foram salvos com sucesso.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", getApiErrorMessage(error, "Não foi possível salvar suas alterações agora."));
    } finally {
      setSaving(false);
    }
  }

  function handleChangePhoto() {
    // Seleção real de imagem usaria expo-image-picker (API de galeria/câmera
    // do Android/iOS) — deixado como próximo passo do backlog.
    Alert.alert("Em breve", "A troca de foto de perfil ainda está em desenvolvimento.");
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

        {!loading && (
          <>
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Avatar size={84} editable onPressEdit={handleChangePhoto} />
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.primary, marginTop: 10 }}>
                Alterar foto de perfil
              </Text>
            </View>

            <Field label="Nome completo" value={form.nome} onChangeText={(v) => setForm({ ...form, nome: v })} />
            <Field label="E-mail" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address" />
            <Field label="Telefone" value={form.telefone} onChangeText={(v) => setForm({ ...form, telefone: v })} keyboardType="phone-pad" />
            <Field
              label="Data de nascimento"
              value={form.dataNascimento}
              onChangeText={(v) => setForm({ ...form, dataNascimento: maskDateInput(v) })}
              keyboardType="number-pad"
            />
            <Field label="Tipo Sanguíneo" value={form.tipoSanguineo} onChangeText={(v) => setForm({ ...form, tipoSanguineo: v })} />
            <Field label="Alergias" value={form.alergias} onChangeText={(v) => setForm({ ...form, alergias: v })} />
            <Field label="Medicamentos em uso" value={form.medicamentosEmUso} onChangeText={(v) => setForm({ ...form, medicamentosEmUso: v })} />
            <Field label="Plano de Saúde" value={form.planoDeSaude} onChangeText={(v) => setForm({ ...form, planoDeSaude: v })} />

            <View style={{ marginTop: 8 }}>
              <PrimaryButton label="Salvar Alterações" loading={saving} onPress={handleSave} />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
