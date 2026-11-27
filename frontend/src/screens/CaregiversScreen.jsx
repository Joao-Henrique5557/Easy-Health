import React, { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
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
import { caregiversService } from "@/services/caregiversService";

export function CaregiversScreen({ navigation }) {
  const [cidade, setCidade] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenLinkedIn = async () => {
    setLoading(true);
    try {
      const url = await caregiversService.getSearchLink(cidade);
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Aviso", "Não foi possível abrir o navegador neste dispositivo.");
      }
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o link de busca de cuidadoras.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Buscar Cuidadoras</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="people" size={28} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Encontre profissionais qualificados</Text>
          <Text style={styles.heroSubtitle}>
            Pesquise cuidadoras de idosos diretamente no LinkedIn para visualizar experiências, formação e recomendações.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Filtrar por cidade (opcional)</Text>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={20} color={colors.inkSoft} />
            <TextInput
              style={styles.input}
              placeholder="Ex: Maceió, São Miguel dos Campos..."
              placeholderTextColor={colors.inkFaint}
              value={cidade}
              onChangeText={setCidade}
            />
            {Boolean(cidade) && (
              <Pressable onPress={() => setCidade("")}>
                <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={[styles.searchButton, loading && styles.buttonDisabled]}
            onPress={handleOpenLinkedIn}
            disabled={loading}
          >
            <Ionicons name="logo-linkedin" size={20} color={colors.white} />
            <Text style={styles.searchButtonText}>
              {loading ? "Gerando busca..." : "Buscar no LinkedIn"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Boas práticas na escolha</Text>

          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.tipText}>
              Verifique cursos técnicos em enfermagem ou capacitação em gerontologia.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.tipText}>
              Solicite referências de famílias atendidas anteriormente.
            </Text>
          </View>

          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
            <Text style={styles.tipText}>
              Alinhe horários, rotina de medicações e contatos de emergência antes do início.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  headerPlaceholder: {
    width: 40,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 17,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.primaryDark,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.inkSoft,
    textAlign: "center",
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 14,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
  },
  tipsCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tipsTitle: {
    fontSize: 15,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.inkSoft,
  },
});