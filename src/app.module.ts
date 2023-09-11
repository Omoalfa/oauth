import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from './modules/auth/auth.module';
import Users from './modules/user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFunction from './config/config';
import TokenModule from './providers/token/token.module';
import { DBConfig } from './config/interface';
import { APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from './modules/auth/guards/jwt.guard';
import JwtStrategy from './modules/auth/strategies/jwt.strategy';
import UserModule from './modules/user/user.module';
import Company from './modules/company/company.entity';
import CompanyUsers from './modules/company/user/company_user.entity';
import Customers from './modules/company/customer/customer.entity';

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
          entities: [Users, Company, CompanyUsers, Customers]
        }
      },
    }),
    AuthModule,
    TokenModule,
    UserModule,
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
