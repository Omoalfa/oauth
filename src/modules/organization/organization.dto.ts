import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { RoleExists } from "./organization.decorator";
import { IsUniqueEmail } from "../auth/decorators/auth.decorator";

export class UserInviteDto {
  @IsString()
  @IsEmail()
  @IsUniqueEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  requirePasswordChange: boolean;

  @IsInt()
  @RoleExists()
  roleId: number;
}
