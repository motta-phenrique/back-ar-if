import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";
import { SCHEDULE_DISPATCH_QUEUE } from "./queue-names";

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow<string>("REDIS_HOST"),
          port: config.getOrThrow<number>("REDIS_PORT"),
          db: config.getOrThrow<number>("REDIS_DB"),
          // O BullMQ espera por jobs com comandos bloqueantes, que ficam
          // pendurados por vários segundos. O ioredis, por padrão, aborta uma
          // requisição depois de 20 tentativas e derrubaria o worker.
          maxRetriesPerRequest: null,
        },
      }),
    }),
    BullModule.registerQueue({
      name: SCHEDULE_DISPATCH_QUEUE,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: {
          age: 60 * 60 * 24,
          count: 1000,
        },
        removeOnFail: {
          age: 60 * 60 * 24 * 7,
        },
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
