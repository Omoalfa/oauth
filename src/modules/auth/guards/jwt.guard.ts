import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC } from "@/modules/auth/docorators/public.decorator";
import Scopes from "../docorators/scopes.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    // const scopes = this.reflector.getAllAndOverride<ApikeyScopes[] | "user">(Scopes, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;
    return super.canActivate(context);
  }
}

export default JwtAuthGuard;
