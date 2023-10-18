import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Roles from "./role.entity";
import { Repository } from "typeorm";
import { CreateRoleDto } from "./role.dto";
import Organization from "../../modules/organization/organization.entity";
import { EScopes } from "./scopes";


@Injectable()
class RoleServies {
  constructor (
    @InjectRepository(Roles) private readonly roleRepo: Repository<Roles>,
  ) {}

  public roleExists = async (id: number, organizationId: number): Promise<Roles> => {
    return await this.roleRepo.findOneBy({ id, owner: { id: organizationId }});
  }

  public createRoles = async (organization: Organization, data: CreateRoleDto) => {
    const scopes = data.scopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")
    
    const role = this.roleRepo.create({
      title: data.title, scopes, owner: organization, isActive: data.isActive
    })

    return await this.roleRepo.save(role);
  }

  public getRoles = async () => {
    const roles = await this.roleRepo.find();

    return roles;
  }

  public getScopes = async (organization: Organization) => {
    const scopes = Object.values(EScopes).map(s => s.replace("{ORG_SLUG}", organization.slug));

    return scopes;
  }

  public addScope = async (org: Organization, id: number, data: Partial<CreateRoleDto>) => {
    const { scopes: raw } = data;

    const role = await this.roleRepo.findOneBy({ id });

    const scopes = raw.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", org.slug)}`, role.scopes)

    await this.roleRepo.update({ id }, { scopes });

    return { ...role, scopes };
  }

  public removeScope = async (org: Organization, id: number, data: Partial<CreateRoleDto>) => {
    const { scopes: raw } = data;

    const role = await this.roleRepo.findOneBy({ id });

    const toRemoveScopes = raw.map(s => s.replace("{ORG_SLUG}", org.slug))
    const currentScopesArray = role.scopes.split(":::")

    const newScopesArray = currentScopesArray.filter(scope => !toRemoveScopes.includes(scope))

    const scopes = newScopesArray.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", org.slug)}`, "")

    await this.roleRepo.update({ id }, { scopes });

    return { ...role, scopes };
  }

  public switchRoleActivOnOff = async (id: number) => {
    const role = await this.roleRepo.findOneBy({ id });

    await this.roleRepo.update({ id }, { isActive: !role.isActive });

    return { ...role, isActive: !role.isActive }
  }
}

export default RoleServies;
