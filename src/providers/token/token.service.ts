import { UserInviteDto } from "@/modules/organization/organization.dto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

export interface DecodedToken {
  sub: number,
  email: string;
  slug: string;
  scopes?: string[],
  company_id?: number,
  company_user_id?: number,
}

@Injectable()
class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public sign (data: DecodedToken): string {
    const token = this.jwtService.sign(data, {
      secret: this.configService.get<string>("jwt.secret"),
      expiresIn: '1h'
    })

    return token;
  }

  public verify (token: string): DecodedToken {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>("jwt.secret") })
    return decoded as DecodedToken;
  }

  public generateInviteToken (data: UserInviteDto): string {
    const token = this.jwtService.sign(data, {
      secret: this.configService.get<string>("jwt.invite_secret"),
      expiresIn: '30d'
    })

    return token;
  }

  public decodeInviteToken (token: string): UserInviteDto {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>("jwt.invite_secret") });
    return decoded as UserInviteDto;
  }

  public generateVerificationToken (data: { email: string, code: string }): string {
    const token = this.jwtService.sign(data, {
      secret: this.configService.get<string>("jwt.invite_secret"),
      expiresIn: '30d'
    })

    return token;
  }

  public decodeVerificationToken (token: string): { email: string, code: string } {
    const decoded = this.jwtService.verify(token, { secret: this.configService.get<string>("jwt.invite_secret") });
    return decoded as { email: string, code: string };
  }
}

export default TokenService;
