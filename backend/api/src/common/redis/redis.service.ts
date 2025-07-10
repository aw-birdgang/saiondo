import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { createWinstonLogger } from '@common/logger/winston.logger';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = createWinstonLogger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const redisConfig = this.configService.get('common.redis');
    this.client = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      // retryStrategy는 공식 옵션
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => {
      this.logger.log(`Redis connected: ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`);
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error:', error.stack || String(error));
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client ready');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ...args: any[]) {
    try {
      const result = await this.client.set(key, value, ...args);
      this.logger.debug(`[SET] key=${key} value=${value.substring(0, 50)}... args=${JSON.stringify(args)}`);
      return result;
    } catch (error) {
      this.logger.error(`[SET] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async get(key: string) {
    try {
      const value = await this.client.get(key);
      this.logger.debug(`[GET] key=${key} value=${value ? value.substring(0, 50) + '...' : 'null'}`);
      return value;
    } catch (error) {
      this.logger.error(`[GET] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async del(key: string) {
    try {
      const result = await this.client.del(key);
      this.logger.debug(`[DEL] key=${key} result=${result}`);
      return result;
    } catch (error) {
      this.logger.error(`[DEL] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      const result = await this.client.incr(key);
      this.logger.debug(`[INCR] key=${key} result=${result}`);
      return result;
    } catch (error) {
      this.logger.error(`[INCR] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    try {
      const result = await this.client.expire(key, seconds);
      this.logger.debug(`[EXPIRE] key=${key} seconds=${seconds} result=${result}`);
      return result;
    } catch (error) {
      this.logger.error(`[EXPIRE] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    try {
      const result = await this.client.mget(...keys);
      this.logger.debug(`[MGET] keys=${keys.join(',')} result=${result.length} items`);
      return result;
    } catch (error) {
      this.logger.error(`[MGET] Failed for keys=${keys.join(',')}:`, error);
      throw error;
    }
  }

  async mset(keyValuePairs: Record<string, string>): Promise<'OK'> {
    try {
      const result = await this.client.mset(keyValuePairs);
      this.logger.debug(`[MSET] pairs=${Object.keys(keyValuePairs).length} items`);
      return result;
    } catch (error) {
      this.logger.error(`[MSET] Failed:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      const result = await this.client.exists(key);
      this.logger.debug(`[EXISTS] key=${key} result=${result}`);
      return result;
    } catch (error) {
      this.logger.error(`[EXISTS] Failed for key=${key}:`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis client connection closed');
    }
  }
}