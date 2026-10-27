import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./modules/user/user.module";
import { envSchema } from "@/infra/env";
import { AuthModule } from "./auth/auth.module";
import { CampusModule } from "./modules/campus/campus.module";
import { BlockModule } from "./modules/block/block.module";
import { RoomModule } from "./modules/room/room.module";
import { ScheduleModule } from "./modules/schedule/schedule.module";
import { CacheModule } from "./cache/cache.module";
import { QueueModule } from "./queue/queue.module";
// O pacote `@nestjs/schedule` exporta uma classe com o mesmo nome do módulo de
// agendamentos deste projeto, por isso o alias.
import { ScheduleModule as CronModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    CacheModule,
    QueueModule,
    CronModule.forRoot(),
    AuthModule,
    UserModule,
    CampusModule,
    BlockModule,
    RoomModule,
    ScheduleModule
  ],
  controllers: [],
})
export class AppModule {}
