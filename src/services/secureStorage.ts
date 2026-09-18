import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Keys for hardware-encrypted storage
const KEYS = {
  AUTH_TOKEN: 'bijlioptima_auth_token_v1',
  USER_PROFILE: 'bijlioptima_user_profile_v1',
  SECURITY_PIN: 'bijlioptima_security_pin_v1',
  RELAY_OVERRIDES: 'bijlioptima_relay_overrides_v1',
} as const;

// In-memory web fallback to avoid crashes in browser environments
const webMemoryStorage: Record<string, string> = {};

export const secureStorage = {
  /**
   * Securely saves an encrypted key-value pair into hardware keychain/keystore
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        webMemoryStorage[key] = value;
        return;
      }
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.warn(`SecureStore setItem failed for key ${key}, falling back:`, error);
      webMemoryStorage[key] = value;
    }
  },

  /**
   * Retrieves decrypted value from secure store
   */
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return webMemoryStorage[key] || null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore getItem failed for key ${key}:`, error);
      return webMemoryStorage[key] || null;
    }
  },

  /**
   * Deletes a key from secure store
   */
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        delete webMemoryStorage[key];
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`SecureStore removeItem failed for key ${key}:`, error);
      delete webMemoryStorage[key];
    }
  },

  // Specialized Auth Token Methods
  async saveAuthToken(token: string): Promise<void> {
    await this.setItem(KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken(): Promise<string | null> {
    return await this.getItem(KEYS.AUTH_TOKEN);
  },

  async clearAuthToken(): Promise<void> {
    await this.removeItem(KEYS.AUTH_TOKEN);
  },

  // Security PIN Methods (for unlocking critical high-voltage contactors)
  async saveSecurityPin(pin: string): Promise<void> {
    await this.setItem(KEYS.SECURITY_PIN, pin);
  },

  async verifySecurityPin(pinCandidate: string): Promise<boolean> {
    const storedPin = await this.getItem(KEYS.SECURITY_PIN);
    if (!storedPin) {
      // Default initial PIN: '2468'
      return pinCandidate === '2468';
    }
    return storedPin === pinCandidate;
  },

  // User Profile
  async saveUserProfile(profile: object): Promise<void> {
    await this.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile<T>(): Promise<T | null> {
    const data = await this.getItem(KEYS.USER_PROFILE);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  },
};
