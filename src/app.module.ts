import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthModule from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFunction from './config/config';
import TokenModule from './providers/token/token.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import JwtAuthGuard from './modules/auth/guards/jwt.guard';
import JwtStrategy from './modules/auth/strategies/jwt.strategy';
import OrganizationModule from './modules/organization/organization.module';
import PlatformCustomerModule from './modules/organization/platform/customer/customer.module';
import OrganizationCustomerModule from './modules/organization/customer/customer.module';
import PlatformModule from './modules/organization/platform/platform.module';
import PlatformEmployeesModule from './modules/organization/platform/employee/employee.module';
import OrganizationEmployeesModule from './modules/organization/employee/employee.module';
import PrismaModule from './prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { SubdomainInterceptor } from './interceptors/subdomain.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configFunction],
      isGlobal: true
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    AuthModule,
    TokenModule,
    PlatformModule,
    PlatformCustomerModule,
    PlatformEmployeesModule,
    OrganizationModule,
    OrganizationCustomerModule,
    OrganizationEmployeesModule,
    PrismaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: SubdomainInterceptor
    }
  ], 
})
export class AppModule {}
