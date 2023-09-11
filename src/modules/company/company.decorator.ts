import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import CompanyService from "./company.service";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private companService: CompanyService) {}

  async validate(value: string, args: ValidationArguments) {
    const { constraints } = args;
    try {
      const exist = await this.companService.companyExist(value, constraints[0].field);

      return constraints[0].status && exist;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Company already exist!`;
  }
}

interface CompanyExistsProp {
  field: 'email' | 'name' | 'website' | 'id',
  state: boolean
}

export function CompanyExists(property: CompanyExistsProp, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'companyExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: UserExistsRule,
    });
  };
}
