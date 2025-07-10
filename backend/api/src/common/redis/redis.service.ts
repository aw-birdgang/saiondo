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
    });
    this.logger.log(`Redis client initialized: ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`);
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ...args: any[]) {
    this.logger.log(`[SET] key=${key} value=${value} args=${JSON.stringify(args)}`);
    return this.client.set(key, value, ...args);
  }

  async get(key: string) {
    const value = await this.client.get(key);
    this.logger.log(`[GET] key=${key} value=${value}`);
    return value;
  }

  async del(key: string) {
    this.logger.log(`[DEL] key=${key}`);
    return this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    this.logger.log(`[INCR] key=${key}`);
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    this.logger.log(`[EXPIRE] key=${key} seconds=${seconds}`);
    return this.client.expire(key, seconds);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
      this.logger.log('Redis client connection closed');
    }
  }
}