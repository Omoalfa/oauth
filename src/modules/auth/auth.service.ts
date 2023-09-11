import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import TokenService, { DecodedToken } from "../../providers/token/token.service";
import Users from "@modules/user/user.entity";
import * as bcrypt from "bcryptjs";
import CompanyUsersServices from "../company/user/company_user.service";
import CompanyUsers from "../company/user/company_user.entity";
import { UserSignupDto } from "./auth.dto";
import { nanoid } from "nanoid";
import { ConfigService } from "@nestjs/config";
import MailService from "@/providers/mail/mail.service";

@Injectable()
class AuthService {
  constructor (
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
    private readonly tokenService: TokenService,
    private readonly companyUsersService: CompanyUsersServices,
    private readonly mailerService: MailService,
    private readonly configService: ConfigService,
  ) {}

  private salt = bcrypt.genSaltSync(15);

  public validateUser = async (data: { email: string, password?: string, name?: string, avatar?: string, id?: number }, type: 'local' | 'google'): Promise<Users> => {
    const { email, name, avatar, password, id } = data;
    if (type === 'local' && id) {
      return await this.userRepository.findOneBy({ email, id })
    }

    let user = await this.userRepository.findOneBy({ email });

    if (type === 'local' && password) {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
    }

    if (type === 'google') {
      if (user) return user;
      const new_user = this.userRepository.create({ email, name, avatar, isVerified: true })
      return await this.userRepository.save(new_user);
    }
    return null;
  }

  public isUniqueEmail = async (email: string): Promise<boolean> => {
    const user = this.userRepository.findOneBy({ email });

    return !!user;
  }

  public localSignup = async (data: UserSignupDto) => {
    const { email, name, password: raw } = data;

    const password = bcrypt.hashSync(raw, this.salt);
    const verificationCode = nanoid(5)

    const token = this.tokenService.generateVerificationToken({ email, code: verificationCode })

    const url = `${this.configService.get<string>('frontend.base_url')}/verify?token=${token}`;

    const user = this.userRepository.create({ email, name, password, verificationCode });

    await this.userRepository.save(user);

    await this.mailerService.sendUserConfirmation(email, name, url);

    return;
  }

  public getCompanyCtx = async (user_id: number, id: number): Promise<CompanyUsers> => {
    return await this.companyUsersService.getUserCompanyDetails(user_id, id);
  }

  public login = async (user: Users) => {
    const token = this.tokenService.sign({ email: user.email, sub: user.id })

    return { token };
  }

  public verifyToken = (token: string) : DecodedToken => {
    return this.tokenService.verify(token);
  } 

  public validateEmailAndCode = async (email: string, verificationCode: string): Promise<boolean> => {
    const user = await this.userRepository.findOneBy({ email, verificationCode });

    return !!user;
  }

  public verifyEmail = async (token: string) => {
    const { email } = this.tokenService.decodeVerificationToken(token);

    await this.userRepository.update({ email }, { isVerified: true });

    return;
  }
}

export default AuthService;
