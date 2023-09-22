import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { OrganizationExists, RoleExists } from "./organization.decorator";

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @OrganizationExists({ field: 'name', state: false })
  name: string;

  @IsString()
  @IsEmail()
  @OrganizationExists({ field: 'email', state: false })
  email: string;

  @IsString()
  @IsUrl()
  @OrganizationExists({ field: 'website', state: false })
  website: string;
}

export class UserInviteDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  requirePasswordChange: boolean;

  @IsInt()
  @RoleExists()
  roleId: number;

  @IsInt()
  @OrganizationExists({ field: 'id', state: true })
  id: number;
}
