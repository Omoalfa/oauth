import { Injectable } from '@nestjs/common';
import TokenService from '../../../providers/token/token.service';

@Injectable()
class OrganizationEmployeesServices {
  constructor(private readonly tokenService: TokenService) {}
}

export default OrganizationEmployeesServices;
