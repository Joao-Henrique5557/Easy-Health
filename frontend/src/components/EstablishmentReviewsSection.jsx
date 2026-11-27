import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/typography";
import { reviewsService } from "@/services/reviewsService";
import { profileService } from "@/services/profileService";

export function EstablishmentReviewsSection({ establishmentId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedEstablishmentId, setLoadedEstablishmentId] = useState(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const [hasMyReview, setHasMyReview] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    if (!establishmentId) return;
    try {
      const [list, me] = await Promise.all([
        reviewsService.listByEstablishment(establishmentId),
        profileService.getMe().catch(() => null),
      ]);
      setReviews(list);
      setLoadedEstablishmentId(establishmentId);

      if (me) {
        const mine = list.find(
          (r) =>
            r.usuarioId === me.id ||
            r.pacienteId === me.id ||
            (r.autorNome && r.autorNome === me.nome)
        );
        if (mine) {
          setHasMyReview(true);
          setNota(mine.nota || 5);
          setComentario(mine.comentario || "");
        }
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [establishmentId]);

  useEffect(() => {
    if (!establishmentId) return undefined;
    let active = true;
    Promise.all([
      reviewsService.listByEstablishment(establishmentId),
      profileService.getMe().catch(() => null),
    ])
      .then(([list, me]) => {
        if (!active) return;
        setReviews(list);
        setLoadedEstablishmentId(establishmentId);
        if (me) {
          const mine = list.find(
            (r) =>
              r.usuarioId === me.id ||
              r.pacienteId === me.id ||
              (r.autorNome && r.autorNome === me.nome)
          );
          if (mine) {
            setHasMyReview(true);
            setNota(mine.nota || 5);
            setComentario(mine.comentario || "");
          }
        }
      })
      .catch(() => {
        if (active) {
          setReviews([]);
          setLoadedEstablishmentId(establishmentId);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [establishmentId]);

  async function handleSubmit() {
    if (!comentario.trim()) {
      Alert.alert("Atenção", "Escreva um comentário sobre o atendimento.");
      return;
    }

    setSaving(true);
    try {
      if (hasMyReview) {
        await reviewsService.updateMine(establishmentId, {
          nota,
          comentario: comentario.trim(),
        });
      } else {
        try {
          await reviewsService.create(establishmentId, {
            nota,
            comentario: comentario.trim(),
          });
        } catch (err) {
          if (err?.response?.status === 409 || err?.response?.status === 400) {
            await reviewsService.updateMine(establishmentId, {
              nota,
              comentario: comentario.trim(),
            });
          } else {
            throw err;
          }
        }
      }

      setHasMyReview(true);
      setLoading(true);
      await loadData();
      Alert.alert(
        "Avaliação salva",
        hasMyReview
          ? "Sua avaliação foi atualizada."
          : "Obrigado por avaliar este estabelecimento!"
      );
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível enviar a avaliação. Verifique se você está logado."
      );
    } finally {
      setSaving(false);
    }
  }

  const average =
    reviews.length > 0
      ? (
          reviews.reduce((acc, item) => acc + (Number(item.nota) || 0), 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Avaliações</Text>
        {average && (
          <View style={styles.avgBadge}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.avgText}>
              {average} ({reviews.length})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formLabel}>
          {hasMyReview ? "Editar minha avaliação" : "Avaliar este atendimento"}
        </Text>

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable key={star} onPress={() => setNota(star)}>
              <Ionicons
                name={star <= nota ? "star" : "star-outline"}
                size={26}
                color={star <= nota ? "#F59E0B" : colors.inkFaint}
              />
            </Pressable>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Conte como foi sua experiência..."
          placeholderTextColor={colors.inkFaint}
          value={comentario}
          onChangeText={setComentario}
          multiline
        />

        <Pressable
          style={[styles.submitBtn, saving && styles.disabled]}
          onPress={handleSubmit}
          disabled={saving}
        >
          <Text style={styles.submitBtnText}>
            {saving
              ? "Enviando..."
              : hasMyReview
              ? "Atualizar Avaliação"
              : "Publicar Avaliação"}
          </Text>
        </Pressable>
      </View>

      {loading || loadedEstablishmentId !== establishmentId ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 12 }} />
      ) : reviews.length === 0 ? (
        <Text style={styles.emptyText}>
          Ainda não há avaliações para este local.
        </Text>
      ) : (
        reviews.map((item, idx) => (
          <View key={item.id || idx} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.authorName}>
                {item.autorNome || item.usuarioNome || "Paciente"}
              </Text>
              <View style={styles.reviewStars}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.reviewNote}>{item.nota}</Text>
              </View>
            </View>
            <Text style={styles.reviewComment}>{item.comentario}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts?.bold,
    fontWeight: "700",
    color: colors.ink,
  },
  avgBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.panel,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  avgText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  formCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  formLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.ink,
    minHeight: 68,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 13,
    color: colors.inkFaint,
    textAlign: "center",
    paddingVertical: 12,
  },
  reviewCard: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  authorName: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
  },
  reviewStars: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewNote: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  reviewComment: {
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.inkSoft,
  },
});