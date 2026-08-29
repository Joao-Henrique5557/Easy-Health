import Constants from "expo-constants";

// Em produção, troque `apiUrl` em app.json (extra.apiUrl) ou use variáveis
// de ambiente do EAS (eas.json) por ambiente (dev/staging/prod).
export const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "http://localhost:3333";

export const EMERGENCY_NUMBERS = {
  samu: "192",
  bombeiros: "193",
  policia: "190",
} as const;
