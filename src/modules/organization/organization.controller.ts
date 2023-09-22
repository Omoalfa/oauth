import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import OrganizationService from "./organization.service";
import { CreateOrganizationDto, UserInviteDto } from "./organization.dto";
import { AuthRequest } from "@/interface";
import { ApiTags } from "@nestjs/swagger";
import Users from "../auth/user.entity";

@Controller({ path: "/organization", host: ":slug.:domain" })
@ApiTags("Organization")
class OrganizationController {
  constructor (
    private readonly organizationServices: OrganizationService,
  ) {}

  @Get("/")
  async testGet(@Req() req: AuthRequest) {
    console.log(req.user, req.organization, req.type)
    return { success: true }
  }

  @Post("/")
  async createUserCompany (@Body() body: CreateOrganizationDto, @Req() req: AuthRequest) {
    await this.organizationServices.createUserOrganization(req.user as Users, body);
    return { message: "Company created successfully" }
  }

  @Post("/invite")
  async ogranizationInvitation (@Body() body: UserInviteDto) {
    await this.organizationServices.inviteEmployeeToOrganization(body);
    return { message: "Invitation email sent to user" }
  }
}

export default OrganizationController;
