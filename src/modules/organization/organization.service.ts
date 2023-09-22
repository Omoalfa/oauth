import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Organization from "./organization.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateOrganizationDto, UserInviteDto } from "./organization.dto";
import Invitations from "./invitation.entity";
import TokenService from "@/providers/token/token.service";
import Users from "../auth/user.entity";
import UserRoles from "../auth/user_roles.entity";
import MailService from "@/providers/mail/mail.service";

@Injectable()
class OrganizationService {
  constructor (
    @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(Invitations) private readonly inviteRepo: Repository<Invitations>,
    @InjectRepository(Users) private readonly usersRepo: Repository<Users>,
    private readonly entityManager: EntityManager,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService
  ) {}

  public getOrganizationBySlug = async (slug: string): Promise<Organization> => {
    const organization = await this.organizationRepo.findOneBy({ slug });

    return organization;
  }

  public organizationExist = async (value: string | number, field: 'name' | 'email' | 'website') => {
    let query: any = {};
    query[field] = value

    const organization = await this.organizationRepo.findOneBy(query);
    
    return !!organization;
  }

  public createUserOrganization = async (owner: Users, data: CreateOrganizationDto) => {
    const organization = this.organizationRepo.create({
      ...data, owner,
    })

    return await this.organizationRepo.save(organization);
  }

  public inviteEmployeeToOrganization = async (data: UserInviteDto): Promise<void> => {
    const { id, email, roleId, name, requirePasswordChange } = data;

    let user: Users;

    await this.entityManager.transaction(async manager => {
      const userRepo = manager.getRepository(Users);
      const userRolesRepo = manager.getRepository(UserRoles);

      user = await userRepo.save(userRepo.create({ email, organization: { id }, name, isVerified: !requirePasswordChange }))

      const userRole = await userRolesRepo.save(userRolesRepo.create({ user, role: { id: roleId }, }))

      user.roles = [userRole]
    })

    const token = this.tokenService.generateInviteToken(data);

    this.mailService.sendEmployeeInvitation(email, token, name, requirePasswordChange)
  }
}

export default OrganizationService;
