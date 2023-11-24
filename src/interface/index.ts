import { Organization, Users } from "@prisma/client";
import { Request } from "express";

export interface AuthRequest extends Request {
  user: {
    user: Users,
    scopes: string[],
    organization?: Organization,
    type?: "user" | "api", 
  }
}
