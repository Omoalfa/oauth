import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import GoogleOAuthGuard from "./guards/google-oauth.guard";
import AuthService from "./auth.service";
import Users from "src/entities/user.entity";
import { Request } from "express";
import Public from "src/dtos/public.decorator";

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
  async login (@Req() req: Request) {
    return this.authService.login(req.user as Users);
  }
}

export default AuthController;
