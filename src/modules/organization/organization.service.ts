import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Organization from "./organization.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateOrganizationDto, UserInviteDto } from "./organization.dto";
import Invitations from "./invitation.entity";
import TokenService from "../../providers/token/token.service";
import Users, { EUserType } from "../auth/user.entity";
import UserRoles from "../auth/user_roles.entity";
import MailService from "../../providers/mail/mail.service";
import Roles from "../../providers/roles/role.entity";
import { EScopes, advertisingScopes, designScopes, editorScopes, financeScopes } from "../../providers/roles/scopes";

@Injectable()
class OrganizationService {
  constructor (
    @InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
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
    await this.entityManager.transaction(async manager => {
      const organizationRepo = manager.getRepository(Organization);
      const userRepo = manager.getRepository(Users);
      const roleRepo = manager.getRepository(Roles);
      const userRoleRepo = manager.getRepository(UserRoles);

      let organization = organizationRepo.create({
        ...data, owner,
      })

      organization  = await organizationRepo.save(organization);

      /// create owner user as employee with full priviledge:::
      
      const user = userRepo.create({
        name: owner.name,
        email: owner.email,
        password: owner.password,
        type: EUserType.EMPLOYEE,
        organization,
        isVerified: true,
        avatar: owner.avatar,
      })

      await userRepo.save(user);

      // create default roles

      let sudoRole = roleRepo.create({ title: "Super Admin", scopes: EScopes.SUDO })
      const editorRole = roleRepo.create({ title: "Editor Role", scopes: editorScopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")})
      const designRole = roleRepo.create({ title: "Designer Role", scopes: designScopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")})
      const financeRole = roleRepo.create({ title: "Finance Role", scopes: financeScopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")})
      const advertisingRole = roleRepo.create({ title: "Advertiser Role", scopes: advertisingScopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")})

      await roleRepo.save([editorRole, designRole, financeRole, advertisingRole]);

      sudoRole = await roleRepo.save(sudoRole);

      // assign sudo role to organization onwer :::

      const userRole = userRoleRepo.create({ role: sudoRole, user });

      await userRoleRepo.save(userRole);
    })
    
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
