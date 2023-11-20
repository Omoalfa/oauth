import {
  Body,
  Controller,
  Get,
  HostParam,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import GoogleOAuthGuard from './guards/google-oauth.guard';
import AuthService from './auth.service';
import Public from './decorators/public.decorator';
import { AuthRequest } from '@/interface';
import LocalGuard from './guards/local.guard';
import { UserLoginDto, UserSignupDto, VerifyEmailDto } from './auth.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import Users from './user.entity';
import { Request } from 'express';

@Controller('/auth')
export class GeneralAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/redirect')
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async GoogleLogin(@Req() req: Request, @Query('state') state: string) {
    try {
      const profile = req.user as any;
      const { slug } = JSON.parse(state);

      const valid = await this.authService.validateUser(
        {
          email: profile.email,
          name: profile.displayName,
          slug,
        },
        'google',
      );

      return await this.authService.login(valid.user, slug);
    } catch (error) {
      throw new UnauthorizedException(401, error)
    }
  }
}

@Controller({ path: '/auth', host: ':slug.:domain' })
@ApiTags('Authorization and Authentication')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @Public()
  async auth() {}

  @Post('login')
  @UseGuards(LocalGuard)
  @Public()
  @ApiBody({ type: UserLoginDto })
  async LocalLogin(@Req() req: AuthRequest, @HostParam('slug') slug: string) {

    const authUser = await this.authService.validateUser(
      {
        email: req.user.email,
        password: req.user.password,
        slug,
      },
      'local',
    );

    if (!authUser) {
      throw new UnauthorizedException(401, 'Invalid credentials');
    }

    return this.authService.login(authUser.user as Users, slug);
  }

  @Post('signup')
  @Public()
  async LocalSignup(
    @Body() data: UserSignupDto,
    @HostParam('slug') slug: string,
  ) {
    await this.authService.localSignup(slug, data);

    return {
      message:
        'An activation link has been sent to your email, please activate your account!',
    };
  }

  @Post('email')
  @Public()
  async VerifyEmail(@Query() data: VerifyEmailDto) {
    await this.authService.verifyEmail(data.token);

    return { message: 'Your account is now successfully activated!' };
  }
}

export default AuthController;
