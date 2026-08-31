import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// expo-secure-store usa o Android Keystore / iOS Keychain por baixo dos panos
// — por isso é a opção certa em Android/iOS (que é a plataforma-alvo real do
// projeto, ver readme). Só que expo-secure-store NÃO tem implementação pra
// web: o módulo nativo simplesmente não existe lá, e chamar qualquer método
// dele quebra com "getValueWithKeyAsync is not a function".
//
// `npx expo start` + tecla "w" abre a versão web, útil pra iterar rápido no
// dev — mas sem esse fallback o app quebra a cada reload nessa plataforma.
// Em web, caímos pra AsyncStorage (não criptografado — aceitável só porque
// web aqui é conveniência de desenvolvimento, nunca o alvo de produção).
const isWeb = Platform.OS === "web";

const ACCESS_TOKEN_KEY = "easyhealth.accessToken";
const REFRESH_TOKEN_KEY = "easyhealth.refreshToken";

async function getItem(key: string): Promise<string | null> {
  return isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
}

async function setItem(key: string, value: string): Promise<void> {
  await (isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value));
}

async function deleteItem(key: string): Promise<void> {
  await (isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key));
}

export const tokenStorage = {
  async getAccessToken() {
    return getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await setItem(ACCESS_TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clear() {
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};
