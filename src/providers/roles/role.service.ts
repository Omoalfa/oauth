import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./role.dto";
import { EScopes } from "./scopes";
import PrismaService from "@/prisma/prisma.service";
import { Organization, Role } from "@prisma/client";


@Injectable()
class RoleServies {
  constructor (
    private readonly prismaService: PrismaService
  ) {}

  public roleExists = async (id: number, organizationId: number): Promise<Role> => {
    return await this.prismaService.role.findFirst({
      where: { id, owner: { id: organizationId } }
    })
  }

  public createRoles = async (organization: Organization, data: CreateRoleDto) => {
    const scopes = data.scopes.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", organization.slug)}`, "")
    
    await this.prismaService.role.create({
      data: {
        title: data.title, 
        scopes, 
        owner: { connect: organization }, 
        isActive: data.isActive
      }
    })
  }

  public getRoles = async (owner: Organization): Promise<Role[]> => {
    const roles = await this.prismaService.role.findMany({
      where: { owner },
    });

    return roles;
  }

  public getScopes = async (organization: Organization) => {
    const scopes = Object.values(EScopes).map(s => s.replace("{ORG_SLUG}", organization.slug));

    return scopes;
  }

  public addScope = async (org: Organization, id: number, data: Partial<CreateRoleDto>) => {
    const { scopes: raw } = data;

    const role = await this.prismaService.role.findFirst({
      where: { id }
    });

    const scopes = raw.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", org.slug)}`, role.scopes)

    await this.prismaService.role.update({
      where: { id },
      data: { scopes }
    });

    return { ...role, scopes };
  }

  public removeScope = async (org: Organization, id: number, data: Partial<CreateRoleDto>) => {
    const { scopes: raw } = data;

    const role = await this.prismaService.role.findFirst({
      where: { id }
    });

    const toRemoveScopes = raw.map(s => s.replace("{ORG_SLUG}", org.slug))
    const currentScopesArray = role.scopes.split(":::")

    const newScopesArray = currentScopesArray.filter(scope => !toRemoveScopes.includes(scope))

    const scopes = newScopesArray.reduce((prev, cur) => prev + `:::${cur.replace("{ORG_SLUG}", org.slug)}`, "")

    await this.prismaService.role.update({
      where: { id },
      data: { scopes }
    });

    return { ...role, scopes };
  }

  public switchRoleActivOnOff = async (id: number) => {
    const role = await this.prismaService.role.findFirst({
      where: { id }
    });

    await this.prismaService.role.update({
      where: { id },
      data:  { isActive: !role.isActive }
    });

    return { ...role, isActive: !role.isActive }
  }
}

export default RoleServies;
