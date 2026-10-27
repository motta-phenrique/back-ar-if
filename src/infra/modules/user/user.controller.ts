import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decorater";
import type { TokenPayload } from "@/infra/auth/jwt.strategy";
import { UserService } from "./user.service";
import {
  createAccountBodySchema,
  type CreateAccountDto,
} from "./dto/create-account";
import { ZodValidationPipe } from "@/infra/pipes/zod-validation-pipes";
import {
  sessionAccountBodySchema,
  type SessionAccountDto,
} from "./dto/session-account";
import type { Response } from "express";
import { ConfigService } from "@nestjs/config";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // Precisa ser idêntico entre session e logout: o browser só remove o cookie
  // se httpOnly/secure/sameSite/path baterem com os do cookie original.
  private get tokenCookieOptions() {
    return {
      httpOnly: true,
      secure: this.configService.get("ENVIRONMENT") === "PRODUCTION",
      sameSite: "strict" as const,
      path: "/",
    };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  createAccount(@Body() body: CreateAccountDto) {
    return this.userService.createAccount(body);
  }

  @Post("session")
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(sessionAccountBodySchema))
  async session(
    @Body() body: SessionAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.userService.session(body);
    res.cookie("token", token, {
      ...this.tokenCookieOptions,
      maxAge: 7 * 60 * 60 * 1000, // 7h — mesmo tempo do expiresIn do JWT
    });

    return {
      message: "Session created successfully",
    };
  }

  @Post("logout")
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("token", this.tokenCookieOptions);

    return {
      message: "Logout successful",
    };
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async me(@CurrentUser() user: TokenPayload) {
    return this.userService.me(user.sub);
  }
}
