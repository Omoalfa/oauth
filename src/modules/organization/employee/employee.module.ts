import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrganizationEmployeesServices from './employee.service';
import OrganizationEmployeesController from './employee.controller';
import TokenModule from '../../../providers/token/token.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), TokenModule],
  providers: [OrganizationEmployeesServices],
  controllers: [OrganizationEmployeesController],
  exports: [OrganizationEmployeesServices],
})
class OrganizationEmployeesModule {}

export default OrganizationEmployeesModule;
