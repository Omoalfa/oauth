import { IsEmail, IsJWT, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { IsUniqueEmail, IsValidVerificationToken } from "./docorators/auth.decorator";

export class UserSignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEmail()
  @IsUniqueEmail()
  email: string;
}

export class UserLoginDto {
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsEmail()
  @IsUniqueEmail()
  username: string;
}

export class VerifyEmailDto {
  @IsJWT()
  @IsValidVerificationToken()
  token: string;
}