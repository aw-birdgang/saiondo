/**
 * 캐시 서비스
 * 인메모리 캐싱을 제공하는 서비스
 */
export class CacheService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // TTL 확인
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 캐시에서 데이터 삭제
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 캐시 전체 삭제
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 캐시 키 존재 여부 확인
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // TTL 확인
    if (Date.now() > item.timestamp + item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 캐시 크기 조회
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 만료된 캐시 항목 정리
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.timestamp + item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 캐시 통계 조회
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
} 