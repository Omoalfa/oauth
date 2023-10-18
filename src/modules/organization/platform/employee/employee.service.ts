import { Injectable } from "@nestjs/common";
import TokenService from "../../../../providers/token/token.service";

@Injectable()
class PlatformEmployeesServices {
  constructor (
    private readonly tokenService: TokenService,
  ) {}

 
}

export default PlatformEmployeesServices;
