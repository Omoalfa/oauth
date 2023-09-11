import { IsNotEmpty, IsString } from "class-validator";
import { IsValidInvite } from "./company_user.decorator";

export class JoinCompanyDto {
  @IsString()
  @IsNotEmpty()
  @IsValidInvite()
  token: string;
}
