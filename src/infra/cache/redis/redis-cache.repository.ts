import { Injectable } from '@nestjs/common';
import { CacheRepository } from '../cache-repository';
import { RedisService } from './redis.service';

const EXPIRE_TIME_SECONDS = 60 * 15;

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', EXPIRE_TIME_SECONDS);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
