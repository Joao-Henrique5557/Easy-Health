import Constants from "expo-constants";

// EXPO_PUBLIC_API_URL configura a API por ambiente, inclusive no Docker.
// Sem ela, usamos a configuração do Expo e, por fim, localhost.
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
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants.expoConfig?.extra?.apiUrl ||
  "http://localhost:3333";
export const EMERGENCY_NUMBERS = {
  samu: "192",
  bombeiros: "193",
  policia: "190"
};
