import { Module } from "@nestjs/common";
import OrganizationCustomerController from "./customer.controller";
import OrganizationCustomerService from "./customer.service";

@Module({
  controllers: [OrganizationCustomerController],
  providers: [OrganizationCustomerService]
})
class OrganizationCustomerModule {}

export default OrganizationCustomerModule;
