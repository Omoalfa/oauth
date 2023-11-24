import { Body, Controller, Get, HostParam, Post, Req } from '@nestjs/common';
import OrganizationService from './organization.service';
import { UserInviteDto } from './organization.dto';
import { AuthRequest } from '@/interface';
import { ApiTags } from '@nestjs/swagger';
import { EScopes } from '../../providers/roles/scopes';
import Scopes from '../auth/decorators/scopes.decorator';
import RoleServies from '../../providers/roles/role.service';
import { CreateRoleDto } from '../../providers/roles/role.dto';

@Controller({ path: '/organization', host: ':slug.:domain' })
@ApiTags('Organization')
class OrganizationController {
  constructor(
    private readonly organizationServices: OrganizationService,
    private readonly roleServices: RoleServies,
  ) {}

  @ApiTags('Invite employees to organization')
  @Post('/invite')
  @Scopes(EScopes.CREATE_EMPLOYEES)
  async ogranizationInvitation(
    @Body() body: UserInviteDto,
    @HostParam("slug") slug: string
  ) {
    await this.organizationServices.inviteEmployeeToOrganization(body, slug);
    return { message: 'Invitation email sent to user' };
  }

  @ApiTags('Create new custom roles')
  @Post('/roles')
  @Scopes(EScopes.CREATE_ROLE)
  async createOrganizationRole(
    @Body() body: CreateRoleDto,
    @Req() req: AuthRequest,
  ) {
    return await this.roleServices.createRoles(req.user.organization, body);
  }

  @ApiTags('Get all available scopes')
  @Get('/scopes')
  @Scopes(EScopes.READ_SCOPE)
  async getAvailableScopes(@Req() req: AuthRequest) {
    return await this.roleServices.getScopes(req.user.organization);
  }

  @ApiTags("Get Roles")
  @Get("/roles")
  @Scopes(EScopes.READ_ROLE)
  async getRoles (@Req() req: AuthRequest) {
    return await this.roleServices.getRoles(req.user.organization);
  }
}

export default OrganizationController;
