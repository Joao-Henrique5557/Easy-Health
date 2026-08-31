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

  async setTokens(accessToken: string, refreshToken: string) {
    try {
      if (useSecureStore) {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (e) {
      console.error('Failed to store tokens:', e);
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      if (useSecureStore) {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      } else {
        return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      }
    } catch {
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      if (useSecureStore) {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } else {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      }
    } catch {
      return null;
    }
  },

  async clear() {
    try {
      if (useSecureStore) {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } else {
        await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
      }
    } catch (e) {
      console.error('Failed to clear tokens:', e);
    }
  },
};
