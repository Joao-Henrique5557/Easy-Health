import { Linking, Platform } from "react-native";
import { api } from "./api";
import { EMERGENCY_NUMBERS } from "@/config/env";
/**
 * REGRA DE OURO deste serviço: nenhuma função aqui liga para ninguém
 * sozinha. `callNumber` apenas ABRE o discador nativo do Android/iOS
 * (Linking.openURL com esquema "tel:") — a ligação em si só acontece
 * se o usuário tocar em "ligar" na tela do próprio sistema operacional.
 * Isso é intencional e não deve ser alterado.
 */
export const emergencyService = {
  async callNumber(numero) {
    const url = `tel:${numero}`;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      throw new Error("Este dispositivo não suporta chamadas telefônicas.");
    }
    await Linking.openURL(url);
  },
  getDefaultContacts() {
    return [{
      label: "SAMU",
      numero: EMERGENCY_NUMBERS.samu,
      descricao: "Emergências de saúde"
    }, {
      label: "Bombeiros",
      numero: EMERGENCY_NUMBERS.bombeiros,
      descricao: "Incêndios e resgates"
    }, {
      label: "Polícia",
      numero: EMERGENCY_NUMBERS.policia,
      descricao: "Segurança pública"
    }];
  },
  async getContacts() {
    try {
      const {
        data
      } = await api.get("/api/emergencia/contatos");
      return data;
    } catch {
      return this.getDefaultContacts();
    }
  },
  async getNearbyHospitals(coords) {
    const { data } = await api.get("/api/emergencia/hospitais-proximos", {
      params: coords
    });
    return data;
  },
  /** Abre o app de mapas do sistema com a rota traçada — não navega dentro do app. */
  async openRouteInMaps(destination, label) {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q="
    });
    const latLng = `${destination.latitude},${destination.longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    if (url) await Linking.openURL(url);
  }
};
