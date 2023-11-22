import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import AuthService from '../auth.service';
import TokenService from '../../../providers/token/token.service';

///Constraints ::::::
@ValidatorConstraint({ name: 'UniqueEmail', async: true })
@Injectable()
export class IsUniqueEmailRule implements ValidatorConstraintInterface {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      const exist = await this.authService.isUniqueEmail(value);

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
export class IsValidVerificationTokenRule
  implements ValidatorConstraintInterface
{
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    try {
      const { email, code } = this.tokenService.decodeVerificationToken(value);

      return await this.authService.validateEmailAndCode(email, code);
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid/expired verification code`;
  }
}
