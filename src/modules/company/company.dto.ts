import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { CompanyExists } from "./company.decorator";
import { EUserPosition } from "./user/company_user.entity";

export class CreateCompayDto {
  @IsString()
  @IsNotEmpty()
  @CompanyExists({ field: 'name', state: false })
  name: string;

  @IsString()
  @IsEmail()
  @CompanyExists({ field: 'email', state: false })
  email: string;

  @IsString()
  @IsUrl()
  @CompanyExists({ field: 'website', state: false })
  website: string;
}

export class UserInviteDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsEnum(EUserPosition)
  position: EUserPosition

  @IsInt()
  @CompanyExists({ field: 'id', state: true })
  id: number;
}
