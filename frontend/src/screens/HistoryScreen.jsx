import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { AppAlert as Alert } from "@/services/appAlert";
import { colors } from "@/theme/colors";
import { fonts, radius, spacing } from "@/theme/typography";
import { PillTabs } from "@/components/PillTabs";
import { Pill } from "@/components/Pill";
import { useAppNavigation } from "@/navigation/useAppNavigation";
import { historyService } from "@/services/historyService";
import { authService } from "@/services/authService";
import { useToast } from "@/components/Toast";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatDateShort } from "@/utils/date";

const TABS = [{
  value: "consultas",
  label: "Consultas"
}, {
  value: "exames",
  label: "Exames"
}, {
  value: "vacinas",
  label: "Vacinas"
}, {
  value: "medicamentos",
  label: "Medicamentos"
}, {
  value: "documentos",
  label: "Documentos"
}];
const TYPE_BY_TAB = {
  exames: "exame",
  vacinas: "vacina",
  medicamentos: "medicamento",
  documentos: "documento"
};
const LIST_METHOD_BY_TAB = {
  consultas: "listConsultas",
  exames: "listExames",
  vacinas: "listVacinas",
  medicamentos: "listMedicamentos",
  documentos: "listDocumentos"
};
const EMPTY_FORM = {
  titulo: "",
  data: "",
  descricao: "",
  profissional: "",
  local: ""
};
const FIELD_STYLE = {
  backgroundColor: colors.panel,
  borderColor: colors.line,
  borderRadius: radius.md,
  borderWidth: 1,
  color: colors.ink,
  fontFamily: fonts.regular,
  fontSize: 13,
  marginBottom: 10,
  paddingHorizontal: 12,
  paddingVertical: 11
};

function todayIso() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function RecordFormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline
}) {
  return <View style={{
    marginBottom: 2
  }}>
      <Text style={{
      color: colors.inkSoft,
      fontFamily: fonts.semiBold,
      fontSize: 11,
      marginBottom: 5
    }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[FIELD_STYLE, multiline && {
          minHeight: 76
        }]}
      />
    </View>;
}

export function HistoryScreen() {
  const navigation = useAppNavigation();
  const { showToast } = useToast();
  const [aba, setAba] = useState("consultas");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [refreshVersion, setRefreshVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    historyService[LIST_METHOD_BY_TAB[aba]]()
      .then(data => {
        if (active) setItems(data);
      })
      .catch(error => {
        if (active) {
          setItems([]);
          showToast(getApiErrorMessage(error, "Não foi possível carregar o histórico."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [aba, refreshVersion, showToast]);

  async function handleAddRecord() {
    if (!(await authService.isAuthenticated())) {
      showToast("Entre na sua conta para adicionar registros ao histórico.");
      return;
    }
    setEditing(null);
    setForm({
      ...EMPTY_FORM,
      data: todayIso()
    });
    setModalVisible(true);
  }

  function handleEditRecord(record) {
    setEditing(record);
    setForm({
      titulo: record.titulo,
      data: record.data,
      descricao: record.descricao ?? "",
      profissional: record.profissional ?? "",
      local: record.local ?? ""
    });
    setModalVisible(true);
  }

  async function handleSaveRecord() {
    if (!form.titulo.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(form.data)) {
      showToast("Informe um título e uma data válida no formato AAAA-MM-DD.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tipo: TYPE_BY_TAB[aba],
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim(),
      profissional: form.profissional.trim(),
      local: form.local.trim()
    };
    try {
      if (editing) {
        await historyService.updateRecord(editing.id, payload);
        showToast("Registro atualizado.", "success");
      } else {
        await historyService.createRecord(payload);
        showToast("Registro adicionado ao histórico.", "success");
      }
      setModalVisible(false);
      setRefreshVersion(value => value + 1);
    } catch (error) {
      showToast(getApiErrorMessage(error, "Não foi possível salvar o registro."));
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteRecord(record) {
    Alert.alert("Excluir registro", `Deseja excluir “${record.titulo}” do histórico?`, [{
      text: "Cancelar",
      style: "cancel"
    }, {
      text: "Excluir",
      style: "destructive",
      onPress: async () => {
        try {
          await historyService.deleteRecord(record.id);
          setRefreshVersion(value => value + 1);
          showToast("Registro removido.", "success");
        } catch (error) {
          showToast(getApiErrorMessage(error, "Não foi possível excluir o registro."));
        }
      }
    }]);
  }

  const isConsultationTab = aba === "consultas";
  const emptyLabel = isConsultationTab
    ? "Consultas concluídas aparecerão aqui."
    : `Nenhum registro de ${TABS.find(tab => tab.value === aba)?.label.toLowerCase()} ainda.`;

  return <>
    <ScrollView style={{
      flex: 1,
      backgroundColor: colors.bg
    }} contentContainerStyle={{
      padding: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: 100
    }}>
      <Text style={{
        fontFamily: fonts.bold,
        fontSize: 19,
        color: colors.ink,
        marginBottom: 16
      }}>Meu Histórico</Text>

      <View style={{
        marginBottom: 18
      }}>
        <PillTabs options={TABS} value={aba} onChange={setAba} />
      </View>

      {loading ? <ActivityIndicator color={colors.primary} /> : items.length === 0 ? <Text style={{
        fontFamily: fonts.regular,
        fontSize: 12.5,
        color: colors.inkSoft,
        marginBottom: 18
      }}>{emptyLabel}</Text> : <View style={{
        gap: 10,
        marginBottom: 20
      }}>
        {items.map(item => <View key={item.id} style={{
          backgroundColor: colors.panel,
          borderRadius: radius.lg,
          padding: 14
        }}>
          <View style={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "space-between"
          }}>
            <Text style={{
              color: colors.inkSoft,
              fontFamily: fonts.regular,
              fontSize: 11.5
            }}>{formatDateShort(item.data)}</Text>
            {isConsultationTab && <Pill>{item.status === "concluido" || item.status === "realizada"
              ? "Realizada" : item.status === "cancelado" ? "Cancelada" : "Agendada"}</Pill>}
          </View>
          <Text style={{
            color: colors.ink,
            fontFamily: fonts.bold,
            fontSize: 14,
            marginTop: 6
          }}>{item.titulo ?? item.medico}</Text>
          <Text style={{
            color: colors.inkSoft,
            fontFamily: fonts.regular,
            fontSize: 12,
            marginTop: 2
          }}>{item.especialidade ?? item.profissional ?? ""}{(item.local ?? item.establishmentNome)
            ? ` • ${item.local ?? item.establishmentNome}` : ""}</Text>
          {item.descricao && <Text style={{
            color: colors.ink,
            fontFamily: fonts.regular,
            fontSize: 12,
            lineHeight: 18,
            marginTop: 8
          }}>{item.descricao}</Text>}
          {isConsultationTab && <Pressable onPress={() => navigation.navigate("ConsultationDetail", {
            id: item.id
          })} style={{
            marginTop: 10
          }}>
            <Text style={{
              color: colors.primary,
              fontFamily: fonts.semiBold,
              fontSize: 12
            }}>Ver resumo da consulta →</Text>
          </Pressable>}
          {!isConsultationTab && <View style={{
            flexDirection: "row",
            gap: 18,
            marginTop: 12
          }}>
            <Pressable accessibilityRole="button" onPress={() => handleEditRecord(item)}>
              <Text style={{
                color: colors.primary,
                fontFamily: fonts.semiBold,
                fontSize: 12
              }}>Editar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => handleDeleteRecord(item)}>
              <Text style={{
                color: colors.alertDark,
                fontFamily: fonts.semiBold,
                fontSize: 12
              }}>Excluir</Text>
            </Pressable>
          </View>}
        </View>)}
      </View>}

      {!isConsultationTab && <Pressable onPress={handleAddRecord} style={{
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 6
      }}>
        <Text style={{
          fontFamily: fonts.semiBold,
          fontSize: 13.5,
          color: colors.white
        }}>+ Adicionar Registro</Text>
      </Pressable>}
    </ScrollView>

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{
        backgroundColor: "rgba(17,24,39,0.42)",
        flex: 1,
        justifyContent: "flex-end"
      }}>
        <View style={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: radius.lg,
          borderTopRightRadius: radius.lg,
          maxHeight: "90%",
          padding: spacing.lg
        }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={{
              color: colors.ink,
              fontFamily: fonts.bold,
              fontSize: 18,
              marginBottom: 16
            }}>{editing ? "Editar Registro" : "Adicionar Registro"}</Text>
            <RecordFormField label="Título *" value={form.titulo} placeholder="Ex.: Hemograma" onChangeText={titulo => setForm(current => ({
              ...current,
              titulo
            }))} />
            <RecordFormField label="Data * (AAAA-MM-DD)" value={form.data} placeholder="AAAA-MM-DD" onChangeText={data => setForm(current => ({
              ...current,
              data
            }))} />
            <RecordFormField label="Descrição" value={form.descricao} placeholder="Informações adicionais" multiline onChangeText={descricao => setForm(current => ({
              ...current,
              descricao
            }))} />
            <RecordFormField label="Profissional" value={form.profissional} placeholder="Opcional" onChangeText={profissional => setForm(current => ({
              ...current,
              profissional
            }))} />
            <RecordFormField label="Local" value={form.local} placeholder="Opcional" onChangeText={local => setForm(current => ({
              ...current,
              local
            }))} />
            <Pressable disabled={saving} onPress={handleSaveRecord} style={{
              alignItems: "center",
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              marginTop: 6,
              opacity: saving ? 0.6 : 1,
              paddingVertical: 13
            }}>
              {saving ? <ActivityIndicator color={colors.white} /> : <Text style={{
                color: colors.white,
                fontFamily: fonts.semiBold,
                fontSize: 14
              }}>{editing ? "Salvar alterações" : "Adicionar ao histórico"}</Text>}
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={{
              alignItems: "center",
              paddingVertical: 13
            }}>
              <Text style={{
                color: colors.inkSoft,
                fontFamily: fonts.semiBold,
                fontSize: 13
              }}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  </>;
}
