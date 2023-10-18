import { Test, TestingModule } from '@nestjs/testing';
import AuthController, { GeneralAuthController } from './auth.controller';
import AuthService from './auth.service';
import Users, { EUserType } from './user.entity';
import Organization, { EOrganizationType } from '../organization/organization.entity';
import { UserSignupDto } from './auth.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserRoles from './user_roles.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configFunction from '../../config/config';
import { DBConfig } from '../../config/interface';
import TokenService from '../../providers/token/token.service';
import MailService from '../../providers/mail/mail.service';
import Roles from '../../providers/roles/role.entity';
import Tokens from '../../providers/token/token.entity';
import PlatformCustomerGroup from '../organization/platform/customer/customer_group.entity';
import OrganizationCustomerGroup from '../organization/customer/customer_group.entity';
import OrganizationService from '../organization/organization.service';
import { JwtService } from '@nestjs/jwt';
import MailModule from '../../providers/mail/mail.module';
import { AuthRequest } from '@/interface';
import { Request } from 'express';

describe('AppController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let genAuthController: GeneralAuthController;
  let verificationCode: string;

  const mockUser: UserSignupDto = {
    email: "engr.omoalfa@gmail.com",
    password: "Ol@334_ejgiR",
    name: "Omoalfa Dev"
  }

  let users: Users[] = [
    {
      id: 1,
      name: "Omoalfa Dev",
      type: EUserType.EMPLOYEE,
      email: "admin@advertyzly.com",
      password: "password",
      avatar: "https://google.com",
      username: "Omoalfa"
    }
  ];
  let organizations: Organization[] = [
    {
      email: "admin@advertyzly.com",
      slug: "platform",
      name: "Advertyzly",
      website: "advertyzly.com",
      type: EOrganizationType.PLATFORM,
      id: 1,
    }
  ]

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
        MailModule,
        TypeOrmModule.forFeature([Users, Organization, UserRoles])
      ],
      controllers: [AuthController, GeneralAuthController],
      providers: [AuthService, TokenService, MailService, OrganizationService, JwtService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    genAuthController = app.get<GeneralAuthController>(GeneralAuthController);
    authService = app.get<AuthService>(AuthService);
  });

  it('Should allow signup email and password', async () => {
    jest.spyOn(authService, "localSignup").mockImplementation(async (slug: string, data: UserSignupDto) => {
      const organization = organizations.find(o => o.slug === slug);

      verificationCode = "0000"

      const user = { ...data, id: users.length + 1, verificationCode, isVerified: false, type: EUserType.CUSTOMER, organization }

      users.push(user as Users);
      
      return;
    })
    
    const res = await authController.LocalSignup(mockUser, "platform")

    expect(res).toHaveProperty("message", "An activation link has been sent to your email, please activate your account!")
  });

  it("Should verify user account", async () => {
    jest.spyOn(authService, "verifyEmail").mockImplementation(async (token: string) => {
      const newUsers = users.map(u => {
        if (u.verificationCode === token && !u.isVerified) {
          return {
            ...u, isVerified: true, verificationCode: null
          }
        }
        return u;
      })
    })

    const res = await authController.VerifyEmail({ token: verificationCode });

    expect(res).toHaveProperty("message", "Your account is now successfully activated!")
  })

  it("should allow user login with password and email", async () => {
    jest.spyOn(authService, "login").mockImplementation(async (user: Users, slug) => {
      return { token: "some dummy token" }
    })

    const res = await authController.LocalLogin({ user: users[1] } as AuthRequest, "platform")

    expect(res).toHaveProperty("token", "some dummy token")
  })

  it("should allow google login", async () => {
    const validateUserMockSpy = jest.spyOn(authService, "validateUser").mockImplementation(async (data, type: "google" | "local") => {
      const user = users.find(u => u.email === data.email);
      const organization = organizations.find(o => o.slug === data.slug)

      return { user, organization }
    })

    const loginUserMockSpy = jest.spyOn(authService, "login").mockImplementation(async (user: Users, slug: string) => {
      return { token: "some dummy token" }
    })

    const res = await genAuthController.GoogleLogin({ user: { email: "engr.omoalfa@gmail.com" }} as unknown as Request, '{"slug": "platform"}')

    expect(res).toHaveProperty("token", "some dummy token")
    expect(validateUserMockSpy).toHaveBeenCalled()
    expect(loginUserMockSpy).toHaveBeenCalled()
  })
});
