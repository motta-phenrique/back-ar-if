import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { BlockService } from "./block.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import type { CreateBlockDto } from "./dto/create-block";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import { createBlockBodySchema } from "./dto/create-block";

@UseGuards(AuthGuard("jwt"))
@Controller("block")
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post("/:campusId")
  async create(
    @CurrentUser() user: TokenPayload,
    @Param("campusId") campusId: string,
    @Body(new ZodValidationPipe(createBlockBodySchema)) body: CreateBlockDto,
  ) {
    return this.blockService.create(user.sub, campusId, body);
  }

  @Get("campus/:campusId")
  async listByCampus(
    @CurrentUser() user: TokenPayload,
    @Param("campusId") campusId: string,
  ) {
    return this.blockService.listByCampus(user.sub, campusId);
  }

  @Get(":id")
  async get(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    return this.blockService.get(user.sub, id);
  }
}
