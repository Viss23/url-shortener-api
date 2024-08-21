import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: redis.RedisClientType;

  constructor() {
    this.client = redis.createClient({
      url: process.env.REDIS_URL,
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      console.log('Redis client connected:', this.client.isReady);
    } catch (error) {
      console.error('Error connecting to Redis:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      console.log('Redis client disconnected');
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<unknown> {
    return this.client.set(key, value);
  }

  async setEx(key: string, seconds: number, value: string): Promise<unknown> {
    return this.client.setEx(key, seconds, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    return this.client.expire(key, seconds);
  }
}
