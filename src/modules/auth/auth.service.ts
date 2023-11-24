import { Injectable, InternalServerErrorException } from '@nestjs/common';
import TokenService, {
  DecodedToken,
} from '../../providers/token/token.service';
import * as bcrypt from 'bcryptjs';
import { UserSignupDto } from './auth.dto';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import MailService from '../../providers/mail/mail.service';
import OrganizationService from '../organization/organization.service';
import PrismaService from '@/prisma/prisma.service';
import { Users } from '@prisma/client';

@Injectable()
class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailService,
    private readonly configService: ConfigService,
    private readonly organizationService: OrganizationService,
  ) {}

  private salt = bcrypt.genSaltSync(15);

  public validateUser = async (
    data: {
      email: string;
      slug: string;
      password?: string;
      name?: string;
      avatar?: string;
      id?: number;
    },
    type: 'local' | 'google',
  ) => {
    try {
      const { email, name, avatar, password, id, slug } = data;
      const organization = await this.organizationService.organizationExist(slug, 'slug');

      if (type === 'local' && id) {
        const user = await this.prismaService.users.findFirst({
          where: {
            email, id, organizationId: organization.id
          }
        })

        return user ? { user, organization } : null;
      }

      let user = await this.prismaService.users.findFirst({
        where: {
          email, organizationId: organization.id
        }
      })

      if (type === 'local' && password) {
        if (bcrypt.compareSync(password, user.password)) {
          return { user, organization };
        }
      }

      if (type === 'google') {
        if (user) return { user, organization };
        const new_user = await this.prismaService.users.create({
          data: {
            email,
            name,
            avatar,
            isVerified: true,
            type: "CUSTOMER",
            organization: {
              connect: { id: organization.id }
            },
            username: `user_${nanoid(4)}`
          }
        });

        return { user: new_user, organization };
      }
      return null;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException()
    }
  };

  public isUniqueEmail = async (email: string, slug: string): Promise<boolean> => {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        organization: {
          slug
        }
      }
    });

    return !!user;
  };

  public localSignup = async (slug: string, data: UserSignupDto) => {
    const { email, name, password: raw } = data;

    const organization = await this.organizationService.organizationExist(slug, "slug");

    const password = bcrypt.hashSync(raw, this.salt);
    const verificationCode = nanoid(5);

    // const token = this.tokenService.generateVerificationToken({
    //   email,
    //   code: verificationCode,
    // });

    // const url = `${this.configService.get<string>('frontend.base_url')}/verify?token=${token}`;

    await this.prismaService.users.create({
      data: {
        email,
        name,
        password,
        verificationCode,
        type: "CUSTOMER",
        isVerified: false,
        username: `user_${nanoid(4)}`,
        organization: {
          connect: { id: organization.id }
        },
      }
    });

    // await this.mailerService.sendUserConfirmation(email, name, url);

    return;
  };

  public login = async (user: Users, slug: string) => {
    const token = this.tokenService.sign({
      email: user.email,
      sub: user.id,
      slug,
    });

    return { token };
  };

  public verifyToken = (token: string): DecodedToken => {
    return this.tokenService.verify(token);
  };

  public validateEmailAndCode = async (
    email: string,
    verificationCode: string,
    slug: string,
  ): Promise<boolean> => {
    const user = await this.prismaService.users.findFirst({
      where: {
        email,
        verificationCode,
        organization: { slug }
      }
    });

    return !!user;
  };

  public verifyEmail = async (token: string, slug: string) => {
    const { email } = this.tokenService.decodeVerificationToken(token);

    const organization = await this.organizationService.organizationExist(slug, "slug");

    await this.prismaService.users.update({
      where: { email_organizationId: {
        email, organizationId: organization.id
      }},
      data: {
        isVerified: true
      }
    });

    return;
  };

  public getUserRoles = async (id: number) => {
    const roles = await this.prismaService.userRoles.findMany({
      where: { user: { id } },
      include: { role: true }
    });

    return roles;
  };
}

export default AuthService;
