import { Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import AuthService from "../auth.service";
import TokenService from "../../../providers/token/token.service";
import { ClsService } from "nestjs-cls";

///Constraints ::::::
@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class IsUniqueEmailRule implements ValidatorConstraintInterface {
  constructor(@Inject(AuthService) private readonly authService: AuthService, private readonly clsService: ClsService) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      const slug = this.clsService.get("slug");

      const exist = await this.authService.isUniqueEmail(value, slug);

      return !exist;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already in use!`;
  }
}

@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class IsValidVerificationTokenRule implements ValidatorConstraintInterface {
  constructor(private tokenService: TokenService, private authService: AuthService) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      const request = args.object["request"];
      const slug = request.subdomain;

      const { email, code } = this.tokenService.decodeVerificationToken(value);

      return await this.authService.validateEmailAndCode(email, code, slug);
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid/expired verification code`;
  }
}

