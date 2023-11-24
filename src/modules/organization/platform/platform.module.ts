import { Module } from "@nestjs/common";
import TokenModule from "../../../providers/token/token.module";
import PlatformController from "./platform.controller";
import PlatformService from "./platform.service";
import PlatformCustomerModule from "./customer/customer.module";
import PlatformEmployeesModule from "./employee/employee.module";
import PrismaModule from "@/prisma/prisma.module";
import OrganizationModule from "../organization.module";

@Module({
  imports: [
    PlatformEmployeesModule,
    PlatformCustomerModule,
    TokenModule,
    PrismaModule,
    OrganizationModule
  ],
  controllers: [PlatformController],
  providers: [PlatformService]
})
class PlatformModule {}

export default PlatformModule;
