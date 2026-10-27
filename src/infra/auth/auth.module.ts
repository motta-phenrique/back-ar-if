import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Env } from "@/infra/env";
import { JwtStrategy } from "./jwt.strategy";

@Module({
    imports: [PassportModule, JwtModule.registerAsync({
        global: true,
        inject: [ConfigService],
        useFactory(configService: ConfigService<Env, true>) {
            return {
                secret: configService.get("JWT_SECRET", { infer: true }),
                signOptions: {
                    algorithm: "HS256",
                    expiresIn: 7 * 60 * 60
                },
            };
        },
    })],
    providers: [JwtStrategy],
})
export class AuthModule {}
