import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CompanyUsers from "./company_user.entity";
import CompanyUsersServices from "./company_user.service";
import CompanyUsersController from "./company_user.controller";
import TokenModule from "@/providers/token/token.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyUsers
    ]),
    TokenModule
  ],
  providers: [CompanyUsersServices],
  controllers: [CompanyUsersController],
  exports: [CompanyUsersServices]
})
class CompanyUsersModule {}

export default CompanyUsersModule;
