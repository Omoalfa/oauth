import Users from "../modules/auth/user.entity";
import Organization from "../modules/organization/organization.entity";
import { Request } from "express";

export interface AuthRequest extends Request {
  user: Users,
  scopes: string[],
  organization?: Organization,
  type?: "user" | "api", 
}
