import { Module } from "@nestjs/common";
import { CampusController } from "./campus.controller";
import { CampusService } from "./campus.service";
import { CampusRepository } from "./repositories/campus.repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
    imports: [CacheModule],
    controllers: [CampusController],
    providers: [CampusService, CampusRepository],
})
export class CampusModule {}
