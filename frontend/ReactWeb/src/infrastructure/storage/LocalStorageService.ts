/**
 * 로컬 저장소 서비스
 * 브라우저의 localStorage를 래핑한 서비스
 */
export class LocalStorageService {
  private readonly prefix: string;

  constructor(prefix: string = 'saiondo_') {
    this.prefix = prefix;
  }

  /**
   * 데이터 저장
   */
  set<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.getFullKey(key), serializedData);
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
      throw new Error('Failed to save data to localStorage');
    }
  }

  /**
   * 데이터 조회
   */
  get<T>(key: string): T | null {
    try {
      const serializedData = localStorage.getItem(this.getFullKey(key));
      
      if (serializedData === null) {
        return null;
      }

      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Failed to retrieve data from localStorage:', error);
      return null;
    }
  }

  /**
   * 데이터 삭제
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.getFullKey(key));
    } catch (error) {
      console.error('Failed to remove data from localStorage:', error);
    }
  }

  /**
   * 키 존재 여부 확인
   */
  has(key: string): boolean {
    return localStorage.getItem(this.getFullKey(key)) !== null;
  }

  /**
   * 전체 데이터 삭제
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      
      prefixedKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * 모든 키 조회
   */
  getAllKeys(): string[] {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Failed to get all keys from localStorage:', error);
      return [];
    }
  }

  /**
   * 저장소 크기 조회 (바이트)
   */
  getSize(): number {
    try {
      let totalSize = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
          }
        }
      });
      
      return totalSize;
    } catch (error) {
      console.error('Failed to calculate localStorage size:', error);
      return 0;
    }
  }

  /**
   * 저장소 사용량 확인 (MB)
   */
  getUsageInMB(): number {
    return this.getSize() / (1024 * 1024);
  }

  /**
   * 저장소 용량 제한 확인 (일반적으로 5-10MB)
   */
  isStorageAvailable(): boolean {
    try {
      const testKey = this.getFullKey('test');
      const testValue = 'test';
      
      localStorage.setItem(testKey, testValue);
      localStorage.removeItem(testKey);
      
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 전체 키 생성
   */
  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }
} 