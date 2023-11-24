import { IsEmail, IsNotEmpty, IsString, IsUrl } from "class-validator";
import { OrganizationExists } from "../organization.decorator";

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @OrganizationExists({ field: 'name', state: false })
  name: string;

  @IsString()
  @IsEmail()
  @OrganizationExists({ field: 'email', state: false })
  email: string;

  @IsString()
  @IsUrl()
  @OrganizationExists({ field: 'website', state: false })
  website: string;

  @IsString()
  @IsNotEmpty()
  @OrganizationExists({ field: 'slug', state: false })
  slug: string;
}
