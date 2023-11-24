import { Body, Controller, Post, Req } from "@nestjs/common";
import PlatformService from "./platform.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateOrganizationDto } from "./platform.dto";
import { AuthRequest } from "@/interface";

@Controller({ path: "/", host: "platform.:domain" })
class PlatformController {

  constructor (
    private readonly platformService: PlatformService
  ) {}


  @ApiTags('create organization')
  @Post('/')
  async createUserCompany(
    @Body() body: CreateOrganizationDto,
    @Req() req: AuthRequest,
  ) {
    await this.platformService.createUserOrganization(
      req.user.user,
      body,
    );
    return { message: 'Company created successfully' };
  }
  
}

export default PlatformController;
