import { IsNotEmpty, IsString } from "class-validator";
import { IsValidInvite } from "./employee.decorator";

export class JoinCompanyDto {
  @IsString()
  @IsNotEmpty()
  @IsValidInvite()
  token: string;
}
