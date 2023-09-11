import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Company from "./company.entity";
import { Repository } from "typeorm";
import Users from "../user/user.entity";
import { CreateCompayDto, UserInviteDto } from "./company.dto";
import Invitations from "./invitation.entity";
import TokenService from "@/providers/token/token.service";

@Injectable()
class CompanyService {
  constructor (
    @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
    @InjectRepository(Invitations) private readonly inviteRepo: Repository<Invitations>,
    private readonly tokenService: TokenService,
  ) {}

  public companyExist = async (value: string | number, field: 'name' | 'email' | 'website') => {
    let query: any = {};
    query[field] = value

    const company = await this.companyRepo.findOneBy(query);
    
    if (!company) return false;
    return true;
  }

  public createUserCompany = async (user: Users, data: CreateCompayDto) => {
    const company = this.companyRepo.create({
      ...data, owner: user,
    })

    return await this.companyRepo.save(company);
  }

  public inviteUsersToCompany = async (data: UserInviteDto): Promise<string> => {
    const { id, position, email } = data;

    const inviteToken = this.tokenService.generateInviteToken(data);

    await this.inviteRepo.save({ email, company: { id }, position, inviteToken });

    return inviteToken;
  }
}

export default CompanyService;
