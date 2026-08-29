import * as SecureStore from "expo-secure-store";

// expo-secure-store usa o Android Keystore / iOS Keychain por baixo dos panos —
// por isso o token de acesso NUNCA deve ir para AsyncStorage puro (não é criptografado).
const ACCESS_TOKEN_KEY = "easyhealth.accessToken";
const REFRESH_TOKEN_KEY = "easyhealth.refreshToken";

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
