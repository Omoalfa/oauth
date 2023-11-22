import { Module } from '@nestjs/common';
import AuthController, { GeneralAuthController } from './auth.controller';
import AuthService from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import GoogleStrategy from './strategies/google-oauth.strategy';
import TokenModule from '../../providers/token/token.module';
import { LocalStrategy } from './strategies/local.strategy';
import MailModule from '../../providers/mail/mail.module';
import Users from './user.entity';
import OrganizationModule from '../organization/organization.module';
import UserRoles from './user_roles.entity';
import {
  IsUniqueEmailRule,
  IsValidVerificationTokenRule,
} from './constraints/auth.constraints';

@Module({
  controllers: [AuthController, GeneralAuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    LocalStrategy,
    IsUniqueEmailRule,
    IsValidVerificationTokenRule,
  ],
  imports: [
    TypeOrmModule.forFeature([Users, UserRoles]),
    PassportModule,
    TokenModule,
    MailModule,
    OrganizationModule,
  ],
  exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
