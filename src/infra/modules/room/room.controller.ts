import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RoomService } from "./room.service";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import type { CreateRoomDto } from "./dto/create-room";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import { createRoomBodySchema } from "./dto/create-room";

@UseGuards(AuthGuard("jwt"))
@Controller("room")
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post("/:blockId")
  async create(
    @CurrentUser() user: TokenPayload,
    @Param("blockId") blockId: string,
    @Body(new ZodValidationPipe(createRoomBodySchema)) body: CreateRoomDto,
  ) {
    return this.roomService.create(user.sub, blockId, body);
  }

  @Get("block/:blockId")
  async listByBlock(
    @CurrentUser() user: TokenPayload,
    @Param("blockId") blockId: string,
  ) {
    return this.roomService.listByBlock(user.sub, blockId);
  }

  @Get(":id")
  async get(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    return this.roomService.get(user.sub, id);
  }
}
