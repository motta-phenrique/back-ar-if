import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import type { Env } from "../env";
import { Injectable } from "@nestjs/common";
import type { Request } from "express";

export type TokenPayload = { sub: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.token ?? null,
      ]),
      secretOrKey: config.get("JWT_SECRET", { infer: true }),
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenPayload) {
    return payload;
  }
}

