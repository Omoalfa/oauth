import PrismaService from "@/prisma/prisma.service";
import { EScopes, advertisingScopes, designScopes, editorScopes, financeScopes } from "@/providers/roles/scopes";
import { Injectable } from "@nestjs/common";
import { Prisma, Users } from "@prisma/client";
import { CreateOrganizationDto } from "./platform.dto";

export interface EmployeeCtx {
  id: number;
  companyId: number;
  employeeId: number;
  roleId: number;
}

@Injectable()
class PlatformService {
  constructor (
    private readonly prismaService: PrismaService,
  ) {}


  public createUserOrganization = async (
    user: Users,
    data: CreateOrganizationDto,
  ) => {


    let sudoRole: Prisma.RoleCreateWithoutOwnerInput = {
      title: 'Super Admin',
      scopes: EScopes.SUDO,
    };
    const editorRole: Prisma.RoleCreateWithoutOwnerInput = {
      title: 'Editor Role',
      scopes: editorScopes.reduce(
        (prev, cur) =>
          prev + `:::${cur.replace('{ORG_SLUG}', data.slug)}`,
        '',
      ),
    };
    const designRole: Prisma.RoleCreateWithoutOwnerInput = {
      title: 'Designer Role',
      scopes: designScopes.reduce(
        (prev, cur) =>
          prev + `:::${cur.replace('{ORG_SLUG}', data.slug)}`,
        '',
      ),
    };
    const financeRole: Prisma.RoleCreateWithoutOwnerInput = {
      title: 'Finance Role',
      scopes: financeScopes.reduce(
        (prev, cur) =>
          prev + `:::${cur.replace('{ORG_SLUG}', data.slug)}`,
        '',
      )
    };
    const advertisingRole: Prisma.RoleCreateWithoutOwnerInput = {
      title: 'Advertiser Role',
      scopes: advertisingScopes.reduce(
        (prev, cur) =>
          prev + `:::${cur.replace('{ORG_SLUG}', data.slug)}`,
        '',
      )
    };

    const owner = await this.prismaService.users.findFirst({
      where: { id: user.id },
      select: {
        email: true,
        password: true,
        isVerified: true,
        name: true,
        username: true,
      }
    })

    const organization = await this.prismaService.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        email: data.email,
        owner: {
          connect: {
            id: user.id
          }
        },
        users: {
          create: [
            { ...owner, type: "EMPLOYEE" }
          ]
        },
        roles: {
          create: [
            advertisingRole, designRole, financeRole, editorRole, sudoRole
          ]
        },
        type: "CLIENT",
        website: data.website
      },
      include: {
        roles: true,
        users: true,
      }
    })

    const admin = organization.users[0];
    const adminRole = organization.roles.find(r => r.scopes === EScopes.SUDO)

    await this.prismaService.userRoles.create({
      data: {
        user: {
          connect: { id: admin.id }
        },
        role: {
          connect: { id: adminRole.id }
        }
      }
    })

  };

}

export default PlatformService;
