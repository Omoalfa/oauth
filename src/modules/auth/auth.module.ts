import { Module } from "@nestjs/common";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import GoogleStrategy from "./strategies/google-oauth.strategy";
import TokenModule from "../../providers/token/token.module";
import Users from "../user/user.entity";
import { LocalStrategy } from "./strategies/local.strategy";
import CompanyUsersModule from "../company/user/company_user.module";
import MailModule from "@/providers/mail/mail.module";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    GoogleStrategy,
    LocalStrategy
  ],
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule,
    TokenModule,
    CompanyUsersModule,
    MailModule
  ],
  exports: [AuthService]
})
class AuthModule {}

export default AuthModule;
