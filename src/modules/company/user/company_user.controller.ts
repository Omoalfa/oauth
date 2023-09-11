import { Controller, Param, Post, Query, Req } from "@nestjs/common";
import CompanyUsersServices from "./company_user.service";
import { JoinCompanyDto } from "./company_user.dto";
import { AuthRequest } from "@/interface";

@Controller("/company/users")
class CompanyUsersController {
  constructor (
    private readonly companyUserService: CompanyUsersServices,
  ) {}

  @Post('/')
  async joinCompany (@Query() query: JoinCompanyDto, @Req() req: AuthRequest) {
    await this.companyUserService.joinCompany(req.user, query.token)
    return { success: true }
  }
}

export default CompanyUsersController;
