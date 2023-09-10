import { Module } from "@nestjs/common";
import TokenService from "./token.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule],
  exports: [TokenService],
  providers: [TokenService]
})
class TokenModule {}

export default TokenModule;
