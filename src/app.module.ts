import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFunction from './config/config';
import TokenModule from './providers/token/token.module';
import { DBConfig } from './config/interface';
import { APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from './modules/auth/guards/jwt.guard';
import JwtStrategy from './modules/auth/strategies/jwt.strategy';
import OrganizationModule from './modules/organization/organization.module';
import Tokens from './providers/token/token.entity';
import Organization from './modules/organization/organization.entity';
import PlatformCustomerModule from './modules/organization/platform/customer/customer.module';
import OrganizationCustomerModule from './modules/organization/customer/customer.module';
import PlatformModule from './modules/organization/platform/platform.module';
import PlatformEmployeesModule from './modules/organization/platform/employee/employee.module';
import OrganizationEmployeesModule from './modules/organization/employee/employee.module';
import Users from './modules/auth/user.entity';
import PlatformCustomerGroup from './modules/organization/platform/customer/customer_group.entity';
import OrganizationCustomerGroup from './modules/organization/customer/customer_group.entity';
import Roles from './providers/roles/role.entity';
import UserRoles from './modules/auth/user_roles.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configFunction],
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        const db = configService.get<DBConfig>("database");
        
        return {
          type: 'postgres',
          host: db.host,
          password: db.password,
          username: db.username,
          database: db.name,
          port: db.port,
          ssl: db.ssl,
          synchronize: true,
          entities: [
            Users, 
            Organization,
            Tokens,
            PlatformCustomerGroup,
            OrganizationCustomerGroup,
            Roles,
            UserRoles
          ]
        }
      },
    }),
    AuthModule,
    TokenModule,
    PlatformModule,
    PlatformCustomerModule,
    PlatformEmployeesModule,
    OrganizationModule,
    OrganizationCustomerModule,
    OrganizationEmployeesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ], 
})
export class AppModule {}
