import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Users from "@modules/user/user.entity";
import { Repository } from "typeorm";
import CompanyUsers from "../company/user/company_user.entity";
import Company from "../company/company.entity";
import CompanyUsersServices from "../company/user/company_user.service";
import TokenService from "@/providers/token/token.service";

export interface EmployeeCtx {
  id: number;
  companyId: number;
  employeeId: number;
  roleId: number;
}

@Injectable()
class UserService {
  constructor (
    @InjectRepository(Users) private readonly UserRepository: Repository<Users>,
    private readonly companyUsersServices: CompanyUsersServices,
    private readonly tokenServices: TokenService
  ) {}

  public getUserCompanies = async (id: number): Promise<Company[]> => {
    const user = await this.UserRepository.findOne({
      where: { id },
      relations: {
        employers: {
          company: true,
        }
      }
    })

    const companies = user.employers.map(e => e.company);

    return companies;
  }

  public getUserCompanyContextToken = async (id: number, user: Users): Promise<{ token: string }> => {
    const companyUser = await this.companyUsersServices.getUserCompanyDetails(user.id, id);

    const token = this.tokenServices.sign({
      sub: companyUser.user.id,
      email: companyUser.user.email,
      scopes: companyUser.scopes,
      company_id: companyUser.company.id,
      company_user_id: companyUser.id,
    })

    return { token };
  }
}

export default UserService;
