import { Module } from "@nestjs/common";
import RoleServies from "./role.service";
import PrismaModule from "@/prisma/prisma.module";

@Module({
  imports: [
    PrismaModule
  ],
  providers: [RoleServies],
  exports: [RoleServies]
})
class RoleModule {}

export default RoleModule;
