import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { medicationsService } from "@/services/medicationsService";

export function MedicationsScreen({ navigation }) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [nomeRemedio, setNomeRemedio] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horario, setHorario] = useState("");

  const fetchMedications = useCallback(
    () => medicationsService.listToday(),
    [],
  );

  const loadMedications = useCallback(async () => {
    try {
      const list = await fetchMedications();
      setMedications(list);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os medicamentos de hoje.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchMedications]);

  useEffect(() => {
    let active = true;
    fetchMedications()
      .then((list) => {
        if (active) setMedications(list);
      })
      .catch(() => {
        if (active) {
          Alert.alert(
            "Erro",
            "Não foi possível carregar os medicamentos de hoje.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchMedications]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadMedications();
  };

  const handleCreate = async () => {
    if (!nomeRemedio.trim() || !horario.trim()) {
      Alert.alert("Campos obrigatórios", "Informe o nome do remédio e o horário (ex: 08:00).");
      return;
    }

    setSaving(true);
    try {
      await medicationsService.create({
        nomeRemedio: nomeRemedio.trim(),
        dosagem: dosagem.trim(),
        horario: horario.trim(),
      });
      setNomeRemedio("");
      setDosagem("");
      setHorario("");
      setModalVisible(false);
      await loadMedications();
    } catch {
      Alert.alert("Erro", "Não foi possível cadastrar o medicamento.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async (item) => {
    const id = item.medicamentoId ?? item.id;
    try {
      await medicationsService.confirmIntake(id);
      await loadMedications();
    } catch {
      Alert.alert("Erro", "Não foi possível confirmar a medicação.");
    }
  };

  const takenCount = medications.filter((m) => Boolean(m.tomado)).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Medicamentos</Text>
        <Pressable onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="medical" size={24} color={colors.primary} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Controle Diário</Text>
            <Text style={styles.summarySubtitle}>
              {takenCount} de {medications.length} doses confirmadas hoje
            </Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : medications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={36} color={colors.inkFaint} />
            <Text style={styles.emptyTitle}>Nenhum medicamento agendado</Text>
            <Text style={styles.emptySubtitle}>
              Toque no botão + acima para cadastrar um remédio e horário.
            </Text>
          </View>
        ) : (
          medications.map((item, index) => {
            const name = item.nomeRemedio ?? item.nome_remedio;
            const taken = Boolean(item.tomado);

            return (
              <View key={item.id || index} style={styles.medCard}>
                <View style={styles.medHeader}>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color={colors.primaryDark} />
                    <Text style={styles.timeText}>{item.horario}</Text>
                  </View>

                  <View style={[styles.statusBadge, taken ? styles.statusTaken : styles.statusPending]}>
                    <Text style={[styles.statusText, taken ? styles.statusTakenText : styles.statusPendingText]}>
                      {taken ? "Tomado" : "Pendente"}
                    </Text>
                  </View>
                </View>

                <Text style={styles.medName}>{name}</Text>
                {Boolean(item.dosagem) && <Text style={styles.medDosage}>Dosagem: {item.dosagem}</Text>}

                {!taken && (
                  <Pressable style={styles.confirmButton} onPress={() => handleConfirm(item)}>
                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
                    <Text style={styles.confirmButtonText}>Confirmar tomada</Text>
                  </Pressable>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Medicamento</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.inkSoft} />
              </Pressable>
            </View>

            <Text style={styles.label}>Nome do remédio *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Losartana"
              placeholderTextColor={colors.inkFaint}
              value={nomeRemedio}
              onChangeText={setNomeRemedio}
            />

            <Text style={styles.label}>Dosagem</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 50mg - 1 comprimido"
              placeholderTextColor={colors.inkFaint}
              value={dosagem}
              onChangeText={setDosagem}
            />

            <Text style={styles.label}>Horário *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 08:00"
              placeholderTextColor={colors.inkFaint}
              value={horario}
              onChangeText={setHorario}
              maxLength={5}
            />

            <Pressable
              style={[styles.saveButton, saving && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? "Salvando..." : "Cadastrar Medicamento"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  summarySubtitle: {
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
  },
  loader: {
    marginTop: 40,
  },
  emptyCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 4,
  },
  medCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  medHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusTaken: {
    backgroundColor: colors.primarySoft,
  },
  statusPending: {
    backgroundColor: colors.alertSoft,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTakenText: {
    color: colors.primaryDark,
  },
  statusPendingText: {
    color: colors.alertDark,
  },
  medName: {
    fontSize: 17,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
  },
  medDosage: {
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 4,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 11,
    marginTop: 14,
    gap: 6,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
  },
});