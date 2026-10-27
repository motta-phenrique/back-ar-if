import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(configService: ConfigService) {
    super({
      host: configService.getOrThrow("REDIS_HOST"),
      port: configService.getOrThrow("REDIS_PORT"),
      db: configService.getOrThrow("REDIS_DB"),
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
