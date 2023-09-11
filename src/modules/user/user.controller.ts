import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import UserService from "./user.service";
import { Request } from "express";
import Users from "./user.entity";
import Scopes from "../auth/docorators/scopes.decorator";
import { AuthRequest } from "@/interface";

@Controller("users")
class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Get("me")
  async getMe (@Req() req: Request) {
    return req.user as Users
  }

  @Get("company/:id")
  async GetCompanyContextToken (@Param("id") id: number, @Req() req: AuthRequest) {
    return await this.userService.getUserCompanyContextToken(id, req.user)
  }
}

export default UserController;
