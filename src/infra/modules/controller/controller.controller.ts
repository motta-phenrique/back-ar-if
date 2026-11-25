import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import { ControllerService } from "./controller.service";
import { createControllerBodySchema } from "./dto/create-controller";
import type { CreateControllerDto } from "./dto/create-controller";
import { updateStateBodySchema } from "./dto/update-state";
import type { UpdateStateDto } from "./dto/update-state";

@UseGuards(AuthGuard("jwt"))
@Controller("controller")
export class ControllerController {
  constructor(private readonly controllerService: ControllerService) {}

  @Post("/:roomId")
  async create(
    @CurrentUser() user: TokenPayload,
    @Param("roomId") roomId: string,
    @Body(new ZodValidationPipe(createControllerBodySchema))
    body: CreateControllerDto,
  ) {
    return this.controllerService.create(user.sub, roomId, body);
  }

  @Get("room/:roomId")
  async listByRoom(
    @CurrentUser() user: TokenPayload,
    @Param("roomId") roomId: string,
  ) {
    return this.controllerService.listByRoom(user.sub, roomId);
  }

  @Get(":id")
  async get(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    return this.controllerService.get(user.sub, id);
  }

  @Patch(":id/state")
  async updateState(
    @CurrentUser() user: TokenPayload,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateStateBodySchema)) body: UpdateStateDto,
  ) {
    return this.controllerService.updateState(user.sub, id, body);
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@CurrentUser() user: TokenPayload, @Param("id") id: string) {
    await this.controllerService.remove(user.sub, id);
  }
}
