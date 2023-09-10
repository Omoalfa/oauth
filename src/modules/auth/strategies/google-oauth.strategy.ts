import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import AuthService from "../auth.service";

@Injectable()
class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      scope: ['profile', 'email'],
      ...configService.get("oauth.google")
    })
  }

  async validate (_access_token: string, _refresh_token: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const user = await this.authService.validateUser({ 
      name,
      email: emails[0].value,
      avatar: photos[0].value,
    }, 'google')

    console.log(user)

    done(null, user);
  }
}

export default GoogleStrategy;
