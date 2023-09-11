import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Company from "./company.entity";
import CompanyController from "./company.controller";
import CompanyService from "./company.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company])
  ],
  exports: [CompanyService],
  providers: [CompanyService],
  controllers: [CompanyController]
})
class CompanyModule {};

export default CompanyModule;
