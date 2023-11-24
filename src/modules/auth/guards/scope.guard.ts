import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import Scopes from "../decorators/scopes.decorator";
import { minimatch } from "minimatch";
import { AuthRequest } from "@/interface";


@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const scopes = this.reflector.get<string[]>(Scopes, context.getHandler());
    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!scopes) return true;
    const user = request.user;
    let authorized = false;

    if (!user) return false;

    for (const userScope of request.user.scopes) {
      for (let scope of scopes) {
        scope = scope.replace("{ORG_SLUG}", request.user.organization?.slug);
        authorized = authorized || minimatch(scope, userScope);
        if (authorized) return true;
      }
    }
    return authorized;
  }
}

export default ScopesGuard;
