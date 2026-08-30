import Constants from "expo-constants";

// Em produção, troque `apiUrl` em app.json (extra.apiUrl) ou use variáveis
// de ambiente do EAS (eas.json) por ambiente (dev/staging/prod).
//
// IMPORTANTE sobre qual endereço usar aqui (pegadinha clássica de RN):
// - Web / simulador iOS: "http://localhost:3333" funciona.
// - Emulador Android: "localhost" do emulador NÃO é o do seu computador —
//   use "http://10.0.2.2:3333" (endereço especial que o emulador Android
//   mapeia para o host).
// - Celular físico (via Expo Go/APK): nem localhost nem 10.0.2.2 funcionam
//   — use o IP local da sua máquina na mesma rede Wi-Fi do celular
//   (ex: "http://192.168.0.10:3333", descubra com `ipconfig`/`ifconfig`).
// - Backend rodando via docker-compose: a porta é publicada no host
//   normalmente (ver docker-compose.yml), então as regras acima continuam
//   valendo — o container não muda qual IP o celular usa para chegar nele.
export const API_URL: string =
  (Constants.expoConfig?.extra?.apiUrl as string) ||
  "http://localhost:3333";

export const EMERGENCY_NUMBERS = {
  samu: "192",
  bombeiros: "193",
  policia: "190",
} as const;
