import Users from "@/modules/user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import Company from "../company.entity";
import { EScopes } from "./scopes";

export enum EUserPosition {
  DESIGNER = 'DESIGNER',
  EDITOR = 'EDITOR',
  FINANCE = 'FINANCE',
  ADVERTS = 'ADVERTS',
  ADMIN = 'ADMIN'
}

@Entity("company_users")
@Unique("unique_company_username", ["username", "company"])
@Unique("unique_company_users", ["user", "company"])
class CompanyUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  username: string;

  @Column({ type: "text", enum: EUserPosition })
  position: EUserPosition;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true })
  scopes: EScopes[]

  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Company)
  company: Company;
}

export default CompanyUsers;
