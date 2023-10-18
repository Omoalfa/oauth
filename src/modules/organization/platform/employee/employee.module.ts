import { Module } from "@nestjs/common";
import PlatformEmployeeServices from "./employee.service";
import EmployeesController from "./employee.controller";
import TokenModule from "../../../../providers/token/token.module";

@Module({
  imports: [
    TokenModule
  ],
  providers: [PlatformEmployeeServices],
  controllers: [EmployeesController],
  exports: [PlatformEmployeeServices]
})
class PlatformEmployeesModule {}

export default PlatformEmployeesModule;
