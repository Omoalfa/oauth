import { Test, TestingModule } from '@nestjs/testing';
import AuthService from './auth.service';
import Users, { EUserType } from './user.entity';
import Organization, {
  EOrganizationType,
} from '../organization/organization.entity';
import { UserSignupDto } from './auth.dto';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
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
import MockUserRepository from '../../test/mocks/db/repoMocks/userRepo.mock';
import OrganizationRepoMock from '../../test/mocks/db/repoMocks/organizationRepo.mock';

describe('Auth Service', () => {
  let authService: AuthService;
  let organizationService: OrganizationService;
  let tokenService: TokenService;
  let verificationCode: string;
  let verificationToken: string;

  const mockUser: UserSignupDto = {
    email: 'engr.omoalfa@gmail.com',
    password: 'Ol@334_ejgiR',
    name: 'Omoalfa Dev',
  };

  const organizations: Organization[] = [
    {
      email: 'admin@advertyzly.com',
      slug: 'platform',
      name: 'Advertyzly',
      website: 'advertyzly.com',
      type: EOrganizationType.PLATFORM,
      id: 1,
    },
  ];

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configFunction],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory(configService: ConfigService) {
            const db = configService.get<DBConfig>('database');

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
                UserRoles,
              ],
            };
          },
        }),
        MailModule,
      ],
      providers: [
        AuthService,
        MockUserRepository,
        TokenService,
        MailService,
        OrganizationService,
        JwtService,
        {
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(Organization),
          useClass: OrganizationRepoMock,
        },
        {
          provide: getRepositoryToken(UserRoles),
          useValue: {},
        },
      ],
    })
      .overrideProvider(MailService)
      .useValue({ sendUserConfirmation: jest.fn() })
      .compile();

    authService = app.get<AuthService>(AuthService);
    organizationService = app.get<OrganizationService>(OrganizationService);
    tokenService = app.get<TokenService>(TokenService);
  });

  it('Should allow signup email and password', async () => {
    const mockGenerateVerificationToken = jest.spyOn(
      tokenService,
      'generateVerificationToken',
    );

    await authService.localSignup('platform', mockUser);

    const { code } = mockGenerateVerificationToken.mock.lastCall[0];
    const data = mockGenerateVerificationToken.mock.results[0];
    verificationToken = data.value;
    verificationCode = code;

    expect(mockGenerateVerificationToken).toHaveBeenCalledTimes(1);
  });

  it('Should validate user verification code', async () => {
    const validVerificationCode = await authService.validateEmailAndCode(
      mockUser.email,
      verificationCode,
    );

    expect(validVerificationCode).toEqual(true);
  });

  it('Wrong verification code should return false!', async () => {
    const validVerificationCode = await authService.validateEmailAndCode(
      mockUser.email,
      '123',
    );

    expect(validVerificationCode).toEqual(false);
  });

  it('Should verify user email', async () => {
    const decodeVerificationTokenMock = jest.spyOn(
      tokenService,
      'decodeVerificationToken',
    );

    authService.verifyEmail(verificationToken);

    expect(decodeVerificationTokenMock).toBeCalledTimes(1);
  });
});
