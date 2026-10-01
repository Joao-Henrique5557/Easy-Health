import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
let useSecureStore = true;
const testSecureStore = async () => {
  try {
    await SecureStore.setItemAsync('__test__', 'test');
    await SecureStore.deleteItemAsync('__test__');
    return true;
  } catch {
    return false;
  }
};
export const tokenStorage = {
  async init() {
    useSecureStore = await testSecureStore();
  },
  async setTokens(accessToken, refreshToken) {
    if (useSecureStore) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      await AsyncStorage.multiSet([
        [ACCESS_TOKEN_KEY, accessToken],
        [REFRESH_TOKEN_KEY, refreshToken]
      ]);
    }
  },
  async getAccessToken() {
    return useSecureStore
      ? SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
      : AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    return useSecureStore
      ? SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
      : AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async clear() {
    if (useSecureStore) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } else {
      await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
    }
  }
};
