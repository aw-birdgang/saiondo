import type { IUserRepository } from '../../domain/repositories/IUserRepository';
import type { IChannelRepository } from '../../domain/repositories/IChannelRepository';
import type { IMessageRepository } from '../../domain/repositories/IMessageRepository';
import type {
  CacheLevel,
  MultiLevelCacheEntry,
  CacheStats,
  CacheConfig,
  CacheLifecycle,
  CacheWarmupRequest,
  CacheBatchRequest
} from '../dto/MultiLevelCacheDto';

export class MultiLevelCacheService {
  private caches: Map<string, Map<string, MultiLevelCacheEntry>> = new Map();
  private stats: CacheStats;
  private readonly config: CacheConfig;
  private readonly compressionEnabled: boolean;
  private readonly metricsEnabled: boolean;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly channelRepository: IChannelRepository,
    private readonly messageRepository: IMessageRepository,
    config: CacheConfig
  ) {
    this.config = config;
    this.compressionEnabled = config.enableCompression || false;
    this.metricsEnabled = config.enableMetrics || false;

    // 캐시 레벨 초기화
    config.levels.forEach(level => {
      this.caches.set(level.name, new Map());
    });

    // 통계 초기화
    this.stats = {
      totalHits: 0,
      totalMisses: 0,
      hitRate: 0,
      totalSize: 0,
      evictions: 0,
      levels: {},
    };

    config.levels.forEach(level => {
      this.stats.levels[level.name] = {
        hits: 0,
        misses: 0,
        hitRate: 0,
        size: 0,
        evictions: 0,
      };
    });

    // 정기적인 캐시 정리
    this.startCacheCleanup();
  }

  /**
   * 다단계 캐시에서 데이터 조회
   */
  async get<T>(key: string, fetcher?: () => Promise<T>): Promise<T | null> {
    // 모든 레벨에서 순차적으로 조회
    for (const level of this.getSortedLevels()) {
      const cache = this.caches.get(level.name);
      if (!cache) continue;

      const entry = cache.get(key);
      if (entry && !this.isExpired(entry)) {
        // 캐시 히트
        this.updateAccessStats(entry, level.name, true);
        this.promoteToHigherLevels(key, entry, level.priority);
        return this.decompress(entry.value);
      }
    }

    // 캐시 미스
    this.updateMissStats();
    
    // 데이터 페처가 있으면 새로 가져와서 캐시에 저장
    if (fetcher) {
      try {
        const value = await fetcher();
        await this.set(key, value);
        return value;
      } catch (error) {
        console.error('Failed to fetch data for cache:', error);
        return null;
      }
    }

    return null;
  }

  /**
   * 다단계 캐시에 데이터 저장
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const compressedValue = this.compress(value);
          const entry: MultiLevelCacheEntry<T> = {
        key,
        value: await compressedValue,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL || 300000, // 5분 기본
        accessCount: 0,
        lastAccessed: Date.now(),
      };

    // 모든 레벨에 저장 (계층화)
    for (const level of this.getSortedLevels()) {
      await this.setInLevel(level.name, key, entry);
    }
  }

  /**
   * 특정 레벨에만 데이터 저장
   */
  async setInLevel<T>(levelName: string, key: string, value: T, ttl?: number): Promise<void> {
    const cache = this.caches.get(levelName);
    if (!cache) return;

    const level = this.config.levels.find(l => l.name === levelName);
    if (!level) return;

    const entry: MultiLevelCacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      ttl: ttl || level.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    // 캐시 크기 제한 확인
    if (cache.size >= level.maxSize) {
      this.evictFromLevel(levelName);
    }

    cache.set(key, entry);
    this.updateLevelStats(levelName, 'size', cache.size);
  }

  /**
   * 캐시에서 데이터 삭제
   */
  async delete(key: string): Promise<void> {
    for (const levelName of this.caches.keys()) {
      const cache = this.caches.get(levelName);
      if (cache && cache.has(key)) {
        cache.delete(key);
        this.updateLevelStats(levelName, 'size', cache.size);
      }
    }
  }

  /**
   * 캐시 무효화
   */
  async invalidate(pattern: string): Promise<void> {
    for (const levelName of this.caches.keys()) {
      const cache = this.caches.get(levelName);
      if (!cache) continue;

      const keysToDelete: string[] = [];
      for (const key of cache.keys()) {
        if (this.matchesPattern(key, pattern)) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => cache.delete(key));
      this.updateLevelStats(levelName, 'size', cache.size);
    }
  }

  /**
   * 캐시 통계 조회
   */
  getStats(): CacheStats {
    // 전체 통계 계산
    const totalHits = Object.values(this.stats.levels).reduce((sum, level) => sum + level.hits, 0);
    const totalMisses = Object.values(this.stats.levels).reduce((sum, level) => sum + level.misses, 0);
    const total = totalHits + totalMisses;

    this.stats.totalHits = totalHits;
    this.stats.totalMisses = totalMisses;
    this.stats.hitRate = total > 0 ? totalHits / total : 0;
    this.stats.totalSize = Object.values(this.stats.levels).reduce((sum, level) => sum + level.size, 0);

    // 레벨별 히트율 계산
    Object.keys(this.stats.levels).forEach(levelName => {
      const level = this.stats.levels[levelName];
      const levelTotal = level.hits + level.misses;
      level.hitRate = levelTotal > 0 ? level.hits / levelTotal : 0;
    });

    return { ...this.stats };
  }

  /**
   * 캐시 워밍업
   */
  async warmup(keys: string[], fetcher: (key: string) => Promise<any>): Promise<void> {
    const promises = keys.map(async (key) => {
      try {
        const value = await fetcher(key);
        await this.set(key, value);
      } catch (error) {
        console.error(`Failed to warmup cache for key ${key}:`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * 캐시 압축
   */
  async compress<T>(data: T): Promise<T> {
    if (!this.compressionEnabled) return data;

    // 간단한 압축 로직 (실제로는 더 정교한 압축 사용)
    if (typeof data === 'string' && data.length > 1000) {
      // 큰 문자열은 압축
      return data as any;
    }

    return data;
  }

  /**
   * 캐시 압축 해제
   */
  async decompress<T>(data: T): Promise<T> {
    if (!this.compressionEnabled) return data;

    // 압축 해제 로직
    return data;
  }

  /**
   * 배치 작업
   */
  async batchGet<T>(keys: string[], fetcher?: (keys: string[]) => Promise<Map<string, T>>): Promise<Map<string, T>> {
    const result = new Map<string, T>();
    const missingKeys: string[] = [];

    // 캐시에서 조회
    for (const key of keys) {
      const value = await this.get<T>(key);
      if (value !== null) {
        result.set(key, value);
      } else {
        missingKeys.push(key);
      }
    }

    // 누락된 키들을 일괄 조회
    if (missingKeys.length > 0 && fetcher) {
      try {
        const fetchedData = await fetcher(missingKeys);
        for (const [key, value] of fetchedData) {
          result.set(key, value);
          await this.set(key, value);
        }
      } catch (error) {
        console.error('Failed to batch fetch data:', error);
      }
    }

    return result;
  }

  /**
   * 배치 저장
   */
  async batchSet<T>(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    const promises = entries.map(({ key, value, ttl }) => this.set(key, value, ttl));
    await Promise.all(promises);
  }

  /**
   * 캐시 수명 주기 관리
   */
  async getCacheLifecycle(): Promise<CacheLifecycle> {
    const oldestEntries: Array<{ key: string; age: number; level: string }> = [];
    const mostAccessed: Array<{ key: string; accessCount: number; level: string }> = [];
    const expiringSoon: Array<{ key: string; expiresIn: number; level: string }> = [];

    const now = Date.now();

    for (const [levelName, cache] of this.caches) {
      for (const [key, entry] of cache) {
        const age = now - entry.timestamp;
        const expiresIn = entry.timestamp + entry.ttl - now;

        oldestEntries.push({ key, age, level: levelName });
        mostAccessed.push({ key, accessCount: entry.accessCount, level: levelName });
        
        if (expiresIn > 0 && expiresIn < 60000) { // 1분 이내 만료
          expiringSoon.push({ key, expiresIn, level: levelName });
        }
      }
    }

    // 정렬
    oldestEntries.sort((a, b) => b.age - a.age);
    mostAccessed.sort((a, b) => b.accessCount - a.accessCount);
    expiringSoon.sort((a, b) => a.expiresIn - b.expiresIn);

    return {
      oldestEntries: oldestEntries.slice(0, 10),
      mostAccessed: mostAccessed.slice(0, 10),
      expiringSoon: expiringSoon.slice(0, 10),
    };
  }

  private getSortedLevels(): CacheLevel[] {
    return [...this.config.levels].sort((a, b) => a.priority - b.priority);
  }

  private isExpired(entry: MultiLevelCacheEntry): boolean {
    return Date.now() > entry.timestamp + entry.ttl;
  }

  private updateAccessStats(entry: MultiLevelCacheEntry, levelName: string, isHit: boolean): void {
    entry.accessCount++;
    entry.lastAccessed = Date.now();

    if (isHit) {
      this.stats.levels[levelName].hits++;
    } else {
      this.stats.levels[levelName].misses++;
    }
  }

  private updateMissStats(): void {
    this.stats.totalMisses++;
  }

  private updateLevelStats(levelName: string, stat: string, value: number): void {
    if (this.stats.levels[levelName]) {
      (this.stats.levels[levelName] as any)[stat] = value;
    }
  }

  private promoteToHigherLevels(key: string, entry: MultiLevelCacheEntry, currentPriority: number): void {
    // 더 높은 우선순위 레벨로 승격
    const higherLevels = this.config.levels.filter(level => level.priority < currentPriority);
    
    higherLevels.forEach(level => {
      this.setInLevel(level.name, key, entry.value, entry.ttl);
    });
  }

  private evictFromLevel(levelName: string): void {
    const cache = this.caches.get(levelName);
    if (!cache || cache.size === 0) return;

    // LRU (Least Recently Used) 정책으로 제거
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of cache) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      cache.delete(oldestKey);
      this.stats.levels[levelName].evictions++;
      this.stats.evictions++;
    }
  }

  private matchesPattern(key: string, pattern: string): boolean {
    // 간단한 패턴 매칭 (실제로는 정규식 사용)
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(key);
    }
    return key.includes(pattern);
  }

  private startCacheCleanup(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 60000); // 1분마다 정리
  }

  private cleanupExpiredEntries(): void {
    for (const [levelName, cache] of this.caches) {
      const expiredKeys: string[] = [];
      
      for (const [key, entry] of cache) {
        if (this.isExpired(entry)) {
          expiredKeys.push(key);
        }
      }

      expiredKeys.forEach(key => cache.delete(key));
      this.updateLevelStats(levelName, 'size', cache.size);
    }
  }
} 