import type { ICache } from '../interfaces/ICache';

// 메모리 캐시 구현
export class MemoryCache implements ICache {
  private cache = new Map<string, { value: any; expires: number }>();

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item || item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  // 캐시 통계 메서드
  getSize(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
  }

  // 만료된 항목 정리
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key);
      }
    }
  }
}
