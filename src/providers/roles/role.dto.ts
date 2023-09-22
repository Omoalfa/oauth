import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EScopes } from "./scopes";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsEnum(EScopes, { each: true })
  scopes: EScopes[]

  @IsBoolean()
  isActive: boolean;
}
