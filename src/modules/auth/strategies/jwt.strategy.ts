import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { DecodedToken } from "src/modules/token/token.service";
import AuthService from "../auth.service";
import { Request } from "express";
import { Strategy } from "passport-strategy";

class AuthStrategy extends Strategy {
  name = "jwt"
}

@Injectable()
class JwtStrategy extends PassportStrategy(AuthStrategy) {
  constructor (private readonly authService: AuthService) {
    super()
  }

  async authenticate(req: Request): Promise<void> {
    const token = this.extractTokenFromHeader(req);

    if (!(!!token)) return this.fail("Token required", 401);

    try {
      const decoded: DecodedToken = this.authService.verifyToken(token);

      const user = await this.authService.validateUser({ email: decoded.email, id: decoded.sub }, "jwt");

      return this.success(user);
    } catch (error) {
      return this.fail("Invalid token", 401)
    }
  }

  extractTokenFromHeader = (req: Request): string => req.headers.authorization?.replace("Bearer ", "");
}

export default JwtStrategy;
