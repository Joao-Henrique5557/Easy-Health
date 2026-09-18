import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      setAvatarUrl(p.avatarUrl ?? null);
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

  async function handleChangePhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso às suas fotos para trocar a imagem de perfil. Ative em Ajustes do celular."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // já comprime aqui — importante porque vira base64 (ver nota no profileService)
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]?.base64) {
      return;
    }

    const asset = result.assets[0];
    const mimeType = asset.mimeType ?? "image/jpeg";
    const dataUri = `data:${mimeType};base64,${asset.base64}`;

    setUploadingPhoto(true);
    const previousAvatarUrl = avatarUrl;
    setAvatarUrl(dataUri); // atualização otimista — já mostra a foto escolhida na hora

    try {
      const updated = await profileService.updateAvatar(dataUri);
      setAvatarUrl(updated.avatarUrl ?? dataUri);
    } catch (error) {
      setAvatarUrl(previousAvatarUrl); // desfaz a atualização otimista se a API falhar
      Alert.alert("Não foi possível atualizar a foto", getApiErrorMessage(error, "Tente novamente em instantes."));
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

        {!loading && (
          <>
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <View>
                <Avatar uri={avatarUrl} size={84} editable={!uploadingPhoto} onPressEdit={handleChangePhoto} />
                {uploadingPhoto && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 42,
                      backgroundColor: "rgba(0,0,0,0.35)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator color={colors.white} />
                  </View>
                )}
              </View>
              <Text style={{ fontFamily: fonts.semiBold, fontSize: 12.5, color: colors.primary, marginTop: 10 }}>
                {uploadingPhoto ? "Enviando foto..." : "Alterar foto de perfil"}
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
