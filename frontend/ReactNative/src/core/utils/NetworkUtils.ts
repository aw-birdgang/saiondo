import NetInfo from '@react-native-community/netinfo';

export class NetworkUtils {
  static async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  static async getConnectionType(): Promise<string> {
    const state = await NetInfo.fetch();
    return state.type || 'unknown';
  }

  static async isWifi(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.type === 'wifi';
  }

  static async isCellular(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.type === 'cellular';
  }

  static async getConnectionDetails(): Promise<{
    isConnected: boolean;
    type: string;
    isWifi: boolean;
    isCellular: boolean;
  }> {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      type: state.type || 'unknown',
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
    };
  }

  static addConnectionListener(callback: (isConnected: boolean) => void): () => void {
    return NetInfo.addEventListener(state => {
      callback(state.isConnected ?? false);
    });
  }

  static async waitForConnection(timeout: number = 30000): Promise<boolean> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false);
      }, timeout);

      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });

      // Check initial state
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(true);
        }
      });
    });
  }

  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getNetworkSpeedCategory(speed: number): string {
    if (speed < 1) return 'Very Slow';
    if (speed < 5) return 'Slow';
    if (speed < 25) return 'Moderate';
    if (speed < 100) return 'Fast';
    return 'Very Fast';
  }
} 