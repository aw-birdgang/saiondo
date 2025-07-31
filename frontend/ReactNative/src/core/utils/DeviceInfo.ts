import DeviceInfo from 'react-native-device-info';

export class DeviceInfoService {
  private static instance: DeviceInfoService;

  static getInstance(): DeviceInfoService {
    if (!DeviceInfoService.instance) {
      DeviceInfoService.instance = new DeviceInfoService();
    }
    return DeviceInfoService.instance;
  }

  async getDeviceId(): Promise<string> {
    try {
      return await DeviceInfo.getUniqueId();
    } catch (error) {
      console.error('Error getting device ID:', error);
      return 'unknown';
    }
  }

  async getDeviceName(): Promise<string> {
    try {
      return await DeviceInfo.getDeviceName();
    } catch (error) {
      console.error('Error getting device name:', error);
      return 'Unknown Device';
    }
  }

  async getSystemVersion(): Promise<string> {
    try {
      return await DeviceInfo.getSystemVersion();
    } catch (error) {
      console.error('Error getting system version:', error);
      return 'unknown';
    }
  }

  async getAppVersion(): Promise<string> {
    try {
      return await DeviceInfo.getVersion();
    } catch (error) {
      console.error('Error getting app version:', error);
      return '1.0.0';
    }
  }

  async getBuildNumber(): Promise<string> {
    try {
      return await DeviceInfo.getBuildNumber();
    } catch (error) {
      console.error('Error getting build number:', error);
      return '1';
    }
  }

  async getDeviceInfo(): Promise<{
    deviceId: string;
    deviceName: string;
    systemVersion: string;
    appVersion: string;
    buildNumber: string;
    platform: string;
    isTablet: boolean;
  }> {
    try {
      const [
        deviceId,
        deviceName,
        systemVersion,
        appVersion,
        buildNumber,
        platform,
        isTablet,
      ] = await Promise.all([
        this.getDeviceId(),
        this.getDeviceName(),
        this.getSystemVersion(),
        this.getAppVersion(),
        this.getBuildNumber(),
        DeviceInfo.getSystemName(),
        DeviceInfo.isTablet(),
      ]);

      return {
        deviceId,
        deviceName,
        systemVersion,
        appVersion,
        buildNumber,
        platform,
        isTablet,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      throw error;
    }
  }

  isIOS(): boolean {
    return DeviceInfo.getSystemName() === 'iOS';
  }

  isAndroid(): boolean {
    return DeviceInfo.getSystemName() === 'Android';
  }

  async isEmulator(): Promise<boolean> {
    try {
      return await DeviceInfo.isEmulator();
    } catch (error) {
      console.error('Error checking if device is emulator:', error);
      return false;
    }
  }

  async hasNotch(): Promise<boolean> {
    try {
      return await DeviceInfo.hasNotch();
    } catch (error) {
      console.error('Error checking if device has notch:', error);
      return false;
    }
  }
}

export const deviceInfoService = DeviceInfoService.getInstance(); 