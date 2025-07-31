import * as Keychain from 'react-native-keychain';

export class KeychainService {
  private static instance: KeychainService;

  static getInstance(): KeychainService {
    if (!KeychainService.instance) {
      KeychainService.instance = new KeychainService();
    }
    return KeychainService.instance;
  }

  async saveToken(token: string, service: string = 'auth'): Promise<void> {
    try {
      await Keychain.setInternetCredentials(service, 'token', token);
    } catch (error) {
      console.error('Error saving token to keychain:', error);
      throw error;
    }
  }

  async getToken(service: string = 'auth'): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(service);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('Error getting token from keychain:', error);
      return null;
    }
  }

  async removeToken(service: string = 'auth'): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(service);
    } catch (error) {
      console.error('Error removing token from keychain:', error);
      throw error;
    }
  }

  async saveCredentials(
    username: string,
    password: string,
    service: string = 'login'
  ): Promise<void> {
    try {
      await Keychain.setInternetCredentials(service, username, password);
    } catch (error) {
      console.error('Error saving credentials to keychain:', error);
      throw error;
    }
  }

  async getCredentials(service: string = 'login'): Promise<{
    username: string;
    password: string;
  } | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(service);
      return credentials
        ? { username: credentials.username, password: credentials.password }
        : null;
    } catch (error) {
      console.error('Error getting credentials from keychain:', error);
      return null;
    }
  }

  async removeCredentials(service: string = 'login'): Promise<void> {
    try {
      await Keychain.resetInternetCredentials(service);
    } catch (error) {
      console.error('Error removing credentials from keychain:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await Keychain.resetInternetCredentials('auth');
      await Keychain.resetInternetCredentials('login');
    } catch (error) {
      console.error('Error clearing all keychain data:', error);
      throw error;
    }
  }
}

export const keychainService = KeychainService.getInstance(); 