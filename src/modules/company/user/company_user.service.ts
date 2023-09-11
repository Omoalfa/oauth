import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import CompanyUsers from "./company_user.entity";
import { Repository } from "typeorm";
import Users from "@/modules/user/user.entity";
import TokenService from "@/providers/token/token.service";
import { getUserScopes } from "./scopes";

@Injectable()
class CompanyUsersServices {
  constructor (
    @InjectRepository(CompanyUsers) private readonly CompanyUserRepo: Repository<CompanyUsers>,
    private readonly tokenService: TokenService,
  ) {}

  public getUserCompanyDetails = async (user_id: number, company_id: number): Promise<CompanyUsers> => {
    const companyUser = await this.CompanyUserRepo.findOne({
      where: { user: { id: user_id }, company: { id: company_id }},
      relations: ["user", "company"]
    })

    return companyUser;
  }

  public joinCompany = async (user: Users, token: string) => {
    const { id: company_id, position } = this.tokenService.decodeInviteToken(token);
    const scopes = getUserScopes(position);

    const companyUser = this.CompanyUserRepo.create({
      company: { id: company_id },
      user,
      position,
      scopes,
    })
    
    await this.CompanyUserRepo.save(companyUser);
    return;
  }
}

export default CompanyUsersServices;
