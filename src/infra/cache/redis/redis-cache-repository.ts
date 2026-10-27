import { CacheRepository } from "../cache-repository";
import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
    constructor (private readonly redis: RedisService) {}

  get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }
  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 3600);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
