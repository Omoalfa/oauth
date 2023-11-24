import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserInviteDto } from './organization.dto';
import TokenService from '../../providers/token/token.service';
import MailService from '../../providers/mail/mail.service';
import PrismaService from '@/prisma/prisma.service';
import { Organization, Role } from '@prisma/client';
import { nanoid } from 'nanoid';
import RoleServies from '@/providers/roles/role.service';

@Injectable()
class OrganizationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly roleService: RoleServies,
  ) {}

  public organizationExist = async (
    value: string | number,
    field: 'name' | 'email' | 'website' | 'slug',
  ): Promise<Organization> => {
    try {
      let query: any = {};
      query[field] = value;

      const organization = await this.prismaService.organization.findFirst({
        where: query
      });

      return organization;
    } catch (error) {
      throw new InternalServerErrorException()
    }
  };

  public inviteEmployeeToOrganization = async (
    data: UserInviteDto,
    slug: string
  ): Promise<void> => {
    const { email, roleId, name, requirePasswordChange } = data;

    await this.prismaService.users.create({
      data: { 
        email, 
        name, 
        isVerified: !requirePasswordChange, 
        organization: { connect: { slug }}, 
        username: `user_${nanoid(4)}`, 
        type: "EMPLOYEE",
        roles: {
          create: [
            { roleId }
          ]
        }
      }
    })


    const token = this.tokenService.generateInviteToken(data);

    this.mailService.sendEmployeeInvitation(
      email,
      token,
      name,
      requirePasswordChange,
    );
  };

  public GetRoles = async (orgranization: Organization): Promise<Role[]> => {
    return await this.roleService.getRoles(orgranization);
  }
}

export default OrganizationService;
