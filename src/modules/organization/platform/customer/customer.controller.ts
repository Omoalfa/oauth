import { Controller } from "@nestjs/common";
import { OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiTags } from "@nestjs/swagger";

@Controller({ path: "/customer", host: "platform.:domain" })
@ApiTags("Platform customers")
class PlatformCustomerController {
  
}

export default PlatformCustomerController;
