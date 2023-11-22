import { ValidationOptions, registerDecorator } from 'class-validator';
import {
  IsValidVerificationTokenRule,
  IsUniqueEmailRule,
} from '../constraints/auth.constraints';

/// Decorators ::::::::::
export function IsUniqueEmail(
  _property?: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsUniqueEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUniqueEmailRule,
    });
  };
}

export function IsValidVerificationToken(
  _property?: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validVerificaitonToken',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidVerificationTokenRule,
    });
  };
}
