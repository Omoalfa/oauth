import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TokenService, {
  DecodedToken,
} from '../../providers/token/token.service';
import * as bcrypt from 'bcryptjs';
import { UserSignupDto } from './auth.dto';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import MailService from '../../providers/mail/mail.service';
import Users, { EUserType } from './user.entity';
import OrganizationService from '../organization/organization.service';
import Organization from '../organization/organization.entity';
import UserRoles from './user_roles.entity';

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    @InjectRepository(UserRoles)
    private readonly userRoleRepository: Repository<UserRoles>,
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
  ): Promise<{ user: Users; organization: Organization }> => {
    const { email, name, avatar, password, id, slug } = data;
    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    if (type === 'local' && id) {
      const user = await this.userRepository.findOneBy({
        email,
        id,
        organization: { id: organization?.id },
      });

      return user ? { user, organization } : null;
    }

    let user = await this.userRepository.findOneBy({
      email,
      organization: { id: organization?.id },
    });

    if (type === 'local' && password) {
      if (bcrypt.compareSync(password, user.password)) {
        return { user, organization };
      }
    }

    if (type === 'google') {
      if (user) return { user, organization };
      const new_user = this.userRepository.create({
        email,
        name,
        avatar,
        isVerified: true,
        type: EUserType.CUSTOMER,
        organization,
      });

      user = await this.userRepository.save(new_user);

      return { user, organization };
    }
    return null;
  };

  public isUniqueEmail = async (email: string): Promise<boolean> => {
    const user = await this.userRepository.findOneBy({ email });

    console.log(user);
    return !!user;
  };

  public localSignup = async (slug: string, data: UserSignupDto) => {
    const { email, name, password: raw } = data;

    const organization =
      await this.organizationService.getOrganizationBySlug(slug);

    const password = bcrypt.hashSync(raw, this.salt);
    const verificationCode = nanoid(5);

    // const token = this.tokenService.generateVerificationToken({
    //   email,
    //   code: verificationCode,
    // });

    // const url = `${this.configService.get<string>('frontend.base_url')}/verify?token=${token}`;

    const user = this.userRepository.create({
      email,
      name,
      password,
      verificationCode,
      type: EUserType.CUSTOMER,
      organization,
    });

    await this.userRepository.save(user);

    // await this.mailerService.sendUserConfirmation(email, name, url);

    return;
  };

  public login = async (user: Users, slug: string) => {
    const authUser = await this.validateUser(
      {
        email: user.email,
        password: user.password,
        slug,
      },
      'local',
    );
    console.log(authUser, 'here');

    if (!authUser) {
      throw new UnauthorizedException(401, 'Invalid credentials');
    }
    const token = this.tokenService.sign({
      email: authUser.user.email,
      sub: authUser.user.id,
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
  ): Promise<boolean> => {
    const user = await this.userRepository.findOneBy({
      email,
      verificationCode,
    });

    return !!user;
  };

  public verifyEmail = async (token: string) => {
    const { email } = this.tokenService.decodeVerificationToken(token);

    await this.userRepository.update({ email }, { isVerified: true });

    return;
  };

  public getUserRoles = async (id: number) => {
    const roles = await this.userRoleRepository.find({
      where: { user: { id } },
      relations: { role: true },
    });

    return roles;
  };
}

export default AuthService;
