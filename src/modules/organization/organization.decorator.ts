import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import OrganizationService from './organization.service';
import RoleServies from '../../providers/roles/role.service';

@ValidatorConstraint({ name: 'Organization Exists', async: true })
@Injectable()
export class OrganizationExistsRule implements ValidatorConstraintInterface {
  constructor(private organizationService: OrganizationService) {}

  async validate(value: string, args: ValidationArguments) {
    const { constraints } = args;
    try {
      const exist = await this.organizationService.organizationExist(
        value,
        constraints[0].field,
      );
      console.log(exist);

      return constraints[0].status && !!exist;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Organization already exist!`;
  }
}

@ValidatorConstraint({ name: 'Role Exists', async: true })
@Injectable()
export class RoleExistsRule implements ValidatorConstraintInterface {
  constructor(private roleServices: RoleServies) {}

  async validate(value: number, args: ValidationArguments) {
    const id = args.object['id'];
    try {
      const exist = await this.roleServices.roleExists(value, id);

      return !!exist;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Organization already exist!`;
  }
}

interface OrganizationExistsProp {
  field: 'email' | 'name' | 'website' | 'id' | 'slug';
  state: boolean;
}

export function OrganizationExists(
  property: OrganizationExistsProp,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'organizationExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: OrganizationExistsRule,
    });
  };
}

export function RoleExists(
  property?: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'roleExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: RoleExistsRule,
    });
  };
}
