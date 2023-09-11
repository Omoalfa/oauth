import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import Scopes from "../docorators/scopes.decorator";
import { AuthRequest } from "@/interface";
import { EScopes } from "@/modules/company/user/scopes";

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    
  }

  canActivate(context: ExecutionContext) {
    const reqScopes = this.reflector.getAllAndOverride<EScopes[]>(Scopes, [context.getHandler(), context.getClass()]);

    const req = context.switchToHttp().getRequest<AuthRequest>();

    // when scope is not defined for the endpoint:::::
    if (!reqScopes || !reqScopes.length) return true;

    //sudo users can do everything a user can do!
    if (req.user.scopes.includes(EScopes.SUDO)) return true;

    let authorize = false;

    for (const scope of req.user.scopes) {
      if (reqScopes.includes(scope)) {
        authorize = true;
      }
    }

    return authorize;
  }
}

export default ScopeGuard;
