import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { historyShareService } from "@/services/historyShareService";

export function ShareHistoryModal({ visible, onClose }) {
  const [medicoId, setMedicoId] = useState("");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadShares = useCallback(async () => {
    return historyShareService.listShares();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    let active = true;
    loadShares()
      .then((list) => {
        if (active) setShares(list);
      })
      .catch(() => {
        if (active) setShares([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [visible, loadShares]);

  async function refreshShares() {
    try {
      setShares(await loadShares());
    } catch {
      setShares([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!medicoId.trim()) {
      Alert.alert("Campo obrigatório", "Informe o identificador do médico.");
      return;
    }

    setSubmitting(true);
    try {
      await historyShareService.shareWithDoctor(medicoId);
      setMedicoId("");
      setLoading(true);
      await refreshShares();
      Alert.alert("Sucesso", "Histórico compartilhado com o médico.");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Não foi possível compartilhar. Verifique o ID do médico.";
      Alert.alert("Erro", msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(id) {
    try {
      await historyShareService.revokeShare(id);
      setLoading(true);
      await refreshShares();
    } catch {
      Alert.alert("Erro", "Não foi possível revogar o acesso.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Compartilhar Histórico</Text>
            <Pressable
              onPress={() => {
                setLoading(true);
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color={colors.inkSoft} />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Autorize um médico a visualizar seus registros clínicos. Você pode
            revogar o acesso quando quiser.
          </Text>

          <Text style={styles.label}>ID do Médico</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ex: demo-medico"
              placeholderTextColor={colors.inkFaint}
              value={medicoId}
              onChangeText={setMedicoId}
              autoCapitalize="none"
            />
            <Pressable
              style={[styles.shareBtn, submitting && styles.disabled]}
              onPress={handleShare}
              disabled={submitting}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.white} />
              <Text style={styles.shareBtnText}>
                {submitting ? "..." : "Autorizar"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Médicos com acesso ativo</Text>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ScrollView style={styles.list}>
              {shares.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhum compartilhamento ativo no momento.
                </Text>
              ) : (
                shares.map((item) => (
                  <View key={item.id} style={styles.shareCard}>
                    <View style={styles.shareInfo}>
                      <Text style={styles.doctorName}>
                        {item.medicoNome || item.medicoId}
                      </Text>
                      <Text style={styles.doctorId}>ID: {item.medicoId}</Text>
                    </View>
                    <Pressable
                      style={styles.revokeBtn}
                      onPress={() => handleRevoke(item.id)}
                    >
                      <Text style={styles.revokeText}>Revogar</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "82%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts?.bold,
    fontWeight: "700",
    color: colors.ink,
  },
  subtitle: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 19,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.ink,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  shareBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 10,
  },
  list: {
    maxHeight: 240,
  },
  emptyText: {
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: "center",
    paddingVertical: 16,
  },
  shareCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  shareInfo: {
    flex: 1,
    marginRight: 10,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  doctorId: {
    fontSize: 12,
    color: colors.inkSoft,
    marginTop: 2,
  },
  revokeBtn: {
    backgroundColor: colors.alertSoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  revokeText: {
    color: colors.alertDark,
    fontSize: 12.5,
    fontWeight: "700",
  },
});