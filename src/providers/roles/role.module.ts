import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Roles from './role.entity';
import RoleServies from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [RoleServies],
  exports: [RoleServies],
})
class RoleModule {}

export default RoleModule;
