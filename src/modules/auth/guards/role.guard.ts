// import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { Request } from "express";
// import { Observable } from "rxjs";
// import Roles from "@modules/auth/dtos/roles.decorator";
// import Users, { UserRoles } from "@modules/user/user.entity";

// class RoleGuard implements CanActivate {
//   constructor (@Inject(Reflector) private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const httpCtx = context.switchToHttp()
//     const req = httpCtx.getRequest<Request>();

//     const user = req.user as Users;

//     if (user.role === UserRoles.ADMIN) return true;

//     const allowRoles = this.reflector.get(Roles, context.getHandler());

//     if (allowRoles.includes(user.role)) return true;
//     return false;
//   }
// }

// export default RoleGuard;
