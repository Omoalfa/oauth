import { Module } from "@nestjs/common";
import AuthController, { GeneralAuthController } from "./auth.controller";
import AuthService from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import GoogleStrategy from "./strategies/google-oauth.strategy";
import TokenModule from "../../providers/token/token.module";
import { LocalStrategy } from "./strategies/local.strategy";
import MailModule from "../../providers/mail/mail.module";
import OrganizationModule from "../organization/organization.module";
import { IsUniqueEmailRule, IsValidVerificationTokenRule } from "./constraints/auth.constraints";
import PrismaModule from "@/prisma/prisma.module";

@Module({
  controllers: [AuthController, GeneralAuthController],
  providers: [
    AuthService, 
    GoogleStrategy,
    LocalStrategy,
    IsUniqueEmailRule,
    IsValidVerificationTokenRule
  ],
  imports: [
    PrismaModule,
    PassportModule,
    TokenModule,
    MailModule,
    OrganizationModule
  ],
  exports: [AuthService, IsUniqueEmailRule]
})
class AuthModule {}

export default AuthModule;
