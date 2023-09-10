import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import UserService from "./user.service";
import { Request } from "express";
import Users, { UserRoles } from "src/entities/user.entity";
import Roles from "src/dtos/roles.decorator";
import RoleGuard from "../auth/guards/role.guard";

@Controller("users")
class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Get("me")
  async getMe (@Req() req: Request) {
    return req.user as Users
  }

  @Get("role")
  @UseGuards(RoleGuard)
  @Roles([UserRoles.ADMIN])
  roleProtected () {
    return { passthrough: true }
  }
}

export default UserController;
