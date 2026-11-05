import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { AppAlert as Alert } from "@/services/appAlert";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { inputStyle } from "@/theme/inputStyle";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Avatar } from "@/components/Avatar";
import { PrimaryButton } from "@/components/Buttons";
import { profileService } from "@/services/profileService";
import { isoDateToBR, brDateToISO, maskDateInput } from "@/utils/date";
import { getApiErrorMessage } from "@/utils/apiError";
function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  editable = true
}) {
  return <View style={{
    marginBottom: 14
  }}>
      <Text style={{
      fontFamily: fonts.semiBold,
      fontSize: 12,
      color: colors.ink,
      marginBottom: 6
    }}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} editable={editable} style={inputStyle} />
    </View>;
}
export function EditProfileScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    tipoSanguineo: "",
    alergias: "",
    medicamentosEmUso: "",
    planoDeSaude: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  useEffect(() => {
    profileService.getMe().then(p => {
      setAvatarUrl(p.avatarUrl ?? null);
      setForm({
        nome: p.nome ?? "",
        email: p.email ?? "",
        telefone: p.telefone ?? "",
        dataNascimento: p.dataNascimento ? isoDateToBR(p.dataNascimento) : "",
        tipoSanguineo: p.tipoSanguineo ?? "",
        alergias: p.alergias ?? "",
        medicamentosEmUso: p.medicamentosEmUso ?? "",
        planoDeSaude: p.planoDeSaude ?? ""
      });
      setLoading(false);
    });
  }, []);
  async function handleSave() {
    let dataNascimentoISO;
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
        dataNascimento: dataNascimentoISO
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
    try {
      if (updatingAvatar) return;
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permissão necessária", "Permita o acesso às fotos para escolher uma imagem de perfil.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true
      });
      if (result.canceled) return;
      const image = result.assets[0];
      if (!image?.base64) {
        Alert.alert("Imagem indisponível", "Não foi possível ler a imagem selecionada.");
        return;
      }
      if (image.mimeType && !["image/jpeg", "image/png"].includes(image.mimeType)) {
        Alert.alert("Formato não suportado", "Escolha uma imagem JPEG ou PNG.");
        return;
      }
      setUpdatingAvatar(true);
      const saved = await profileService.updateAvatar(
        `data:${image.mimeType === "image/png" ? "image/png" : "image/jpeg"};base64,${image.base64}`
      );
      setAvatarUrl(saved.avatarUrl ?? null);
      Alert.alert("Foto atualizada", "Sua foto de perfil foi salva.");
    } catch (error) {
      Alert.alert("Não foi possível atualizar a foto", getApiErrorMessage(error, "Tente novamente."));
    } finally {
      setUpdatingAvatar(false);
    }
  }
  async function handleRemovePhoto() {
    setUpdatingAvatar(true);
    try {
      await profileService.removeAvatar();
      setAvatarUrl(null);
      Alert.alert("Foto removida", "A foto de perfil foi removida.");
    } catch (error) {
      Alert.alert("Não foi possível remover a foto", getApiErrorMessage(error, "Tente novamente."));
    } finally {
      setUpdatingAvatar(false);
    }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{
    flex: 1,
    backgroundColor: colors.bg
  }}>
      <ScrollView contentContainerStyle={{
      padding: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: 40
    }} keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Editar Perfil" onBack={() => navigation.goBack()} />

        {!loading && <>
            <View style={{
          alignItems: "center",
          marginBottom: 24
        }}>
              <Avatar uri={avatarUrl} size={84} editable onPressEdit={handleChangePhoto} />
              <Text style={{
            fontFamily: fonts.semiBold,
            fontSize: 12.5,
            color: colors.primary,
            marginTop: 10
          }}>
                {updatingAvatar ? "Salvando foto..." : "Alterar foto de perfil"}
              </Text>
              {avatarUrl && <Text onPress={handleRemovePhoto} style={{
                color: colors.alertDark,
                fontFamily: fonts.semiBold,
                fontSize: 12,
                marginTop: 8
              }}>Remover foto</Text>}
            </View>

            <Field label="Nome completo" value={form.nome} onChangeText={v => setForm({
          ...form,
          nome: v
        })} />
            <Field label="E-mail" value={form.email} editable={false} keyboardType="email-address" />
            <Field label="Telefone" value={form.telefone} onChangeText={v => setForm({
          ...form,
          telefone: v
        })} keyboardType="phone-pad" />
            <Field label="Data de nascimento" value={form.dataNascimento} onChangeText={v => setForm({
          ...form,
          dataNascimento: maskDateInput(v)
        })} keyboardType="number-pad" />
            <Field label="Tipo Sanguíneo" value={form.tipoSanguineo} onChangeText={v => setForm({
          ...form,
          tipoSanguineo: v
        })} />
            <Field label="Alergias" value={form.alergias} onChangeText={v => setForm({
          ...form,
          alergias: v
        })} />
            <Field label="Medicamentos em uso" value={form.medicamentosEmUso} onChangeText={v => setForm({
          ...form,
          medicamentosEmUso: v
        })} />
            <Field label="Plano de Saúde" value={form.planoDeSaude} onChangeText={v => setForm({
          ...form,
          planoDeSaude: v
        })} />

            <View style={{
          marginTop: 8
        }}>
              <PrimaryButton label="Salvar Alterações" loading={saving} onPress={handleSave} />
            </View>
          </>}
      </ScrollView>
    </KeyboardAvoidingView>;
}
