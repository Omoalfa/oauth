import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRoles } from "src/entities/user.entity";

export interface DecodedToken {
  sub: number,
  email: string;
  role: UserRoles
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
}

export default TokenService;
