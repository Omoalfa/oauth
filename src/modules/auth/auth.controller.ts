import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import GoogleOAuthGuard from "./guards/google-oauth.guard";
import AuthService from "./auth.service";
import Public from "@/modules/auth/docorators/public.decorator";
import { AuthRequest } from "@/interface";
import LocalGuard from "./guards/local.guard";
import { UserSignupDto, VerifyEmailDto } from "./auth.dto";

@Controller('auth')
class AuthController {
  constructor (
    private readonly authService: AuthService,
  ) {}
  
  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async auth () {}

  @Get("google/redirect")
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async GoogleLogin (@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post("login")
  @UseGuards(LocalGuard)
  @Public()
  async LocalLogin (@Req() req: AuthRequest) {
    return this.authService.login(req.user);
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
