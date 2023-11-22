import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Organization from './organization.entity';
import OrganizationController from './organization.controller';
import OrganizationService from './organization.service';
import TokenModule from '../../providers/token/token.module';
import Invitations from './invitation.entity';
import Users from '../auth/user.entity';
import UserRoles from '../auth/user_roles.entity';
import MailModule from '../../providers/mail/mail.module';
import RoleModule from '../../providers/roles/role.module';
import {
  OrganizationExistsRule,
  RoleExistsRule,
} from './organization.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Invitations, Users, UserRoles]),
    TokenModule,
    MailModule,
    RoleModule,
  ],
  exports: [OrganizationService],
  providers: [OrganizationService, OrganizationExistsRule, RoleExistsRule],
  controllers: [OrganizationController],
})
class OrganizationModule {}

export default OrganizationModule;
