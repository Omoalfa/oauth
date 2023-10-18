import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import TokenService from "../../../../providers/token/token.service";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
class IsValidInviteRule implements ValidatorConstraintInterface {
  constructor(private tokenSevice: TokenService) {}

  validate(value: string, args: ValidationArguments) {
    try {
      const exist = this.tokenSevice.decodeInviteToken(value)

      return !!exist;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid/Expired invitation!`;
  }
}

export function IsValidInvite(property?: any, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'companyExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsValidInviteRule,
    });
  };
}
