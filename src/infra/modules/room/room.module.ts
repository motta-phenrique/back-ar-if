import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";
import { RoomRepository } from "./repositories/room.repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
    imports: [CacheModule],
    controllers: [RoomController],
    providers: [RoomService, RoomRepository],
})
export class RoomModule {}
