import { Body, Controller, Get, HostParam, Post, Query, Req, UseGuards } from "@nestjs/common";
import GoogleOAuthGuard from "./guards/google-oauth.guard";
import AuthService from "./auth.service";
import Public from "@/modules/auth/docorators/public.decorator";
import { AuthRequest } from "@/interface";
import LocalGuard from "./guards/local.guard";
import { UserLoginDto, UserSignupDto, VerifyEmailDto } from "./auth.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import Users from "./user.entity";
import { Request } from "express";

@Controller("/auth")
export class GeneralAuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}

  @Get("google/redirect")
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async GoogleLogin (@Req() req: Request, @Query("state") state: string) {
    const profile = req.user as any
    const { slug } = JSON.parse(state);

    const valid = await this.authService.validateUser({
      email: profile.email,
      name: profile.displayName,
      slug
    }, "google")

    return await this.authService.login(valid.user, slug);
  }
}

@Controller({ path: "/auth", host: ":slug.:domain" })
@ApiTags("Authorization and Authentication")
class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}
  
  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async auth () {}

  @Post("login")
  @UseGuards(LocalGuard)
  @Public()
  @ApiBody({ type: UserLoginDto })
  async LocalLogin (@Req() req: AuthRequest, @HostParam("slug") slug: string) {
    return this.authService.login(req.user as Users, slug);
  }

  @Post("signup")
  @Public()
  async LocalSignup (@Body() data: UserSignupDto) {
    await this.authService.localSignup(data);

    return { message: 'An activation link has been sent to your email, please activate your account!' }
  }

  @Post("email")
  @Public()
  async VerifyEmail (@Query() data: VerifyEmailDto) {
    await this.authService.verifyEmail(data.token);

    return { message: 'Your account is now successfully activated!' }
  }
}

export default AuthController;
