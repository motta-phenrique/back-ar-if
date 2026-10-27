import { Module } from "@nestjs/common";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";
import { BlockRepository } from "./repositories/block.repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
    imports: [CacheModule],
    controllers: [BlockController],
    providers: [BlockService, BlockRepository],
})
export class BlockModule {}
