import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import TokenModule from "../../../providers/token/token.module";
import Users from "./platform.controller";
import PlatformController from "./platform.controller";
import PlatformService from "./platform.service";
import PlatformCustomerModule from "./customer/customer.module";
import PlatformEmployeesModule from "./employee/employee.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PlatformEmployeesModule,
    PlatformCustomerModule,
    TokenModule
  ],
  controllers: [PlatformController],
  providers: [PlatformService]
})
class PlatformModule {}

export default PlatformModule;
