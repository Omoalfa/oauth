import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import OrganizationService from './organization.service';
import { CreateOrganizationDto, UserInviteDto } from './organization.dto';
import { AuthRequest } from '@/interface';
import { ApiTags } from '@nestjs/swagger';
import Users from '../auth/user.entity';
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

  @ApiTags('create organization')
  @Post('/')
  async createUserCompany(
    @Body() body: CreateOrganizationDto,
    @Req() req: AuthRequest,
  ) {
    await this.organizationServices.createUserOrganization(
      req.user as Users,
      body,
    );
    return { message: 'Company created successfully' };
  }

  @ApiTags('Invite employees to organization')
  @Post('/invite')
  @Scopes(EScopes.CREATE_EMPLOYEES)
  async ogranizationInvitation(@Body() body: UserInviteDto) {
    await this.organizationServices.inviteEmployeeToOrganization(body);
    return { message: 'Invitation email sent to user' };
  }

  @ApiTags('Create new custom roles')
  @Post('/roles')
  @Scopes(EScopes.CREATE_ROLE)
  async createOrganizationRole(
    @Body() body: CreateRoleDto,
    @Req() req: AuthRequest,
  ) {
    return await this.roleServices.createRoles(req.organization, body);
  }

  @ApiTags('Get all available scopes')
  @Get('/scopes')
  @Scopes(EScopes.READ_SCOPE)
  async getAvailableScopes(@Req() req: AuthRequest) {
    return await this.roleServices.getScopes(req.organization);
  }
}

export default OrganizationController;
