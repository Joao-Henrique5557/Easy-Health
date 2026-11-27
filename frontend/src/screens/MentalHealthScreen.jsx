import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { mentalHealthService } from "@/services/mentalHealthService";

const ICONS_BY_SLUG = {
  "surto-psicotico": "alert-circle-outline",
  ansiedade: "pulse-outline",
  sonambulismo: "moon-outline",
};

export function MentalHealthScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlug, setSelectedSlug] = useState("todos");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await mentalHealthService.list();
        if (active) setGuides(list);
      } catch {
        if (active) {
          Alert.alert("Erro", "Não foi possível carregar os guias de saúde mental.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredGuides =
    selectedSlug === "todos" ? guides : guides.filter((g) => g.slug === selectedSlug);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.headerTitle}>Saúde Mental</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emergencyBanner}>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyTitle}>Apoio Imediato</Text>
            <Text style={styles.emergencySubtitle}>
              Em caso de risco agudo, acione o SAMU (192) ou o CVV (188).
            </Text>
          </View>
          <Pressable
            style={styles.callButton}
            onPress={() => Linking.openURL("tel:192")}
          >
            <Ionicons name="call" size={16} color={colors.white} />
            <Text style={styles.callButtonText}>192</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <Pressable
            style={[styles.chip, selectedSlug === "todos" && styles.chipActive]}
            onPress={() => setSelectedSlug("todos")}
          >
            <Text style={[styles.chipText, selectedSlug === "todos" && styles.chipTextActive]}>
              Todos
            </Text>
          </Pressable>

          {guides.map((guide) => (
            <Pressable
              key={guide.id || guide.slug}
              style={[styles.chip, selectedSlug === guide.slug && styles.chipActive]}
              onPress={() => setSelectedSlug(guide.slug)}
            >
              <Text style={[styles.chipText, selectedSlug === guide.slug && styles.chipTextActive]}>
                {guide.titulo}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          filteredGuides.map((guide) => {
            const manterSeguranca = guide.manterSeguranca ?? guide.manter_seguranca;
            const comoAjudar = guide.comoAjudar ?? guide.como_ajudar;
            const iconName = ICONS_BY_SLUG[guide.slug] || "heart-outline";

            return (
              <View key={guide.id || guide.slug} style={styles.guideCard}>
                <View style={styles.guideHeader}>
                  <View style={styles.guideIconBox}>
                    <Ionicons name={iconName} size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.guideTitle}>{guide.titulo}</Text>
                </View>

                <View style={styles.safetyBox}>
                  <View style={styles.boxHeader}>
                    <Ionicons name="shield-checkmark" size={16} color={colors.alertDark} />
                    <Text style={styles.safetyLabel}>Manter a Segurança</Text>
                  </View>
                  <Text style={styles.boxText}>{manterSeguranca}</Text>
                </View>

                <View style={styles.helpBox}>
                  <View style={styles.boxHeader}>
                    <Ionicons name="hand-left" size={16} color={colors.primaryDark} />
                    <Text style={styles.helpLabel}>Como Ajudar</Text>
                  </View>
                  <Text style={styles.boxText}>{comoAjudar}</Text>
                </View>
              </View>
            );
          })
        )}
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
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.alertSoft,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.alert,
  },
  emergencyInfo: {
    flex: 1,
    marginRight: 10,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.alertDark,
  },
  emergencySubtitle: {
    fontSize: 12,
    color: colors.ink,
    marginTop: 2,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.alert,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  callButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  chipsRow: {
    gap: 8,
    paddingBottom: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  chipTextActive: {
    color: colors.white,
  },
  loader: {
    marginTop: 40,
  },
  guideCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  guideIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  guideTitle: {
    fontSize: 17,
    fontFamily: fonts?.semiBold,
    fontWeight: "600",
    color: colors.ink,
    flex: 1,
  },
  safetyBox: {
    backgroundColor: colors.alertSoft,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  helpBox: {
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    padding: 12,
  },
  boxHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  safetyLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.alertDark,
  },
  helpLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  boxText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
});