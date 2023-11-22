import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller({ path: '/customer', host: ':slug.:domain' })
@ApiTags('Organization Customers')
class OrganizationCustomerController {}

export default OrganizationCustomerController;
