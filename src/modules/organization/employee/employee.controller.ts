import { Controller, Post, Query, } from "@nestjs/common";
import CompanyUsersServices from "./employee.service";
import { JoinCompanyDto } from "./employee.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller({ path: "/users", host: ":slug.:domain" })
@ApiTags("company employee")
class OrganizationEmployeeController {
  constructor (
    private readonly companyUserService: CompanyUsersServices,
  ) {}

}

export default OrganizationEmployeeController;
