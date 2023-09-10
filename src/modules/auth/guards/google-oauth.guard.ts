import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
class GoogleOAuthGuard extends AuthGuard("google") {}

export default GoogleOAuthGuard;
