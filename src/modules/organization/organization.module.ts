import { Module, forwardRef } from "@nestjs/common";
import OrganizationController from "./organization.controller";
import OrganizationService from "./organization.service";
import TokenModule from "../../providers/token/token.module";
import MailModule from "../../providers/mail/mail.module";
import RoleModule from "../../providers/roles/role.module";
import { OrganizationExistsRule, RoleExistsRule } from "./organization.decorator";
import PrismaModule from "@/prisma/prisma.module";
import AuthModule from "../auth/auth.module";
import { IsUniqueEmailRule } from "../auth/constraints/auth.constraints";

@Module({
  imports: [
    TokenModule,
    MailModule,
    RoleModule,
    PrismaModule,
    // forwardRef(() => AuthModule)
  ],
  exports: [OrganizationService, OrganizationExistsRule, RoleExistsRule],
  providers: [OrganizationService, OrganizationExistsRule, RoleExistsRule],
  controllers: [OrganizationController]
})
class OrganizationModule {};

export default OrganizationModule;
