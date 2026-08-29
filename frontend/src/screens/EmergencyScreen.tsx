import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { fonts, spacing } from "@/theme/typography";
import { useLocation } from "@/hooks/useLocation";
import { emergencyService, EmergencyContact, NearbyHospital } from "@/services/emergencyService";

export function EmergencyScreen() {
  const { coords } = useLocation();
  const [contacts, setContacts] = useState<EmergencyContact[]>(emergencyService.getDefaultContacts());
  const [hospital, setHospital] = useState<NearbyHospital | null>(null);

  useEffect(() => {
    emergencyService.getContacts().then(setContacts);
  }, []);

  useEffect(() => {
    if (!coords) return;
    emergencyService
      .getNearbyHospitals(coords)
      .then((list) => setHospital(list[0] ?? null))
      .catch(() => setHospital(null));
  }, [coords]);

  // A ÚNICA ação de ligação do app: abre o discador nativo.
  // A ligação em si só ocorre se o usuário confirmar na tela do sistema.
  async function handleCall(numero: string) {
    try {
      await emergencyService.callNumber(numero);
    } catch (e) {
      Alert.alert("Não foi possível abrir o discador", "Ligue manualmente para " + numero + ".");
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg }}>
      <View
        style={{
          backgroundColor: colors.alertSoft,
          borderWidth: 1,
          borderColor: "#F3C7B4",
          borderRadius: 14,
          padding: 13,
          marginBottom: 18,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Ionicons name="warning" size={18} color={colors.alertDark} style={{ marginTop: 1 }} />
        <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 12, color: colors.alertDark, lineHeight: 17 }}>
          Este app não liga por você. Toque em um número abaixo para abrir o discador do seu celular — a ligação
          só acontece se você confirmar.
        </Text>
      </View>

      <Text style={{ fontFamily: fonts.bodyBold, fontSize: 11, color: colors.primary, letterSpacing: 1, textTransform: "uppercase" }}>
        Emergência
      </Text>
      <Text style={{ fontFamily: fonts.display, fontSize: 24, color: colors.ink, marginTop: 4, marginBottom: 16 }}>
        Ligue agora
      </Text>

      <View style={{ gap: 8, marginBottom: 24 }}>
        {contacts.map((c) => (
          <Pressable
            key={c.numero}
            onPress={() => handleCall(c.numero)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: colors.ink,
              borderRadius: 14,
              padding: 14,
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.12)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="call" size={17} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.white }}>
                {c.label} — {c.numero}
              </Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                {c.descricao}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 11.5,
          color: colors.inkSoft,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Unidade mais próxima
      </Text>

      {hospital ? (
        <Pressable
          onPress={() =>
            emergencyService.openRouteInMaps(
              { latitude: coords!.latitude, longitude: coords!.longitude },
              hospital.nome
            )
          }
          style={{ backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 13, marginBottom: 20 }}
        >
          <Text style={{ fontFamily: fonts.bodySemiBold, fontSize: 13.5, color: colors.ink }}>{hospital.nome}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: colors.inkSoft, marginTop: 2 }}>
            {hospital.distanciaKm.toFixed(1)} km • {hospital.aberto24h ? "Aberta 24h" : hospital.endereco}
          </Text>
        </Pressable>
      ) : (
        <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.inkSoft, marginBottom: 20 }}>
          Ative sua localização para ver a unidade mais próxima.
        </Text>
      )}

      <Text
        style={{
          fontFamily: fonts.bodyBold,
          fontSize: 11.5,
          color: colors.inkSoft,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 8,
        }}
      >
        Enquanto o socorro não chega
      </Text>
      <View style={{ gap: 6 }}>
        <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.ink, lineHeight: 19 }}>
          • Mantenha a calma e não deixe a pessoa sozinha.
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.ink, lineHeight: 19 }}>
          • Descreva com clareza o que está acontecendo ao atendente.
        </Text>
        <Text style={{ fontFamily: fonts.body, fontSize: 12.5, color: colors.ink, lineHeight: 19 }}>
          • Consulte o guia de Primeiros Socorros para orientações específicas.
        </Text>
      </View>
    </ScrollView>
  );
}
