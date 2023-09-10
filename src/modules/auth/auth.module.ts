import { Module } from "@nestjs/common";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Users from "src/entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import GoogleStrategy from "./strategies/google-oauth.strategy";
import TokenModule from "../token/token.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    GoogleStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    TokenModule,
  ],
  exports: [AuthService]
})
class AuthModule {}

export default AuthModule;
