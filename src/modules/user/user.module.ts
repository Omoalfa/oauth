import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Users from "@modules/user/user.entity";
import UserController from "./user.controller";
import UserService from "./user.service";
import CompanyUsersModule from "../company/user/company_user.module";
import TokenModule from "@/providers/token/token.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    CompanyUsersModule,
    TokenModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
class UserModule {}

export default UserModule;
