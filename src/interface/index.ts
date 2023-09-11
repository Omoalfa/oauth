import Company from "@/modules/company/company.entity";
import CompanyUsers from "@/modules/company/user/company_user.entity";
import { EScopes } from "@/modules/company/user/scopes";
import Users from "@/modules/user/user.entity";
import { Request } from "express";

export interface AuthRequest extends Request {
  user: AuthUser
}

export interface AuthUser extends Users {
  type?: "user" | "api", 
  scopes?: EScopes[], 
  company?: Company,
  companyUser?: CompanyUsers
}
