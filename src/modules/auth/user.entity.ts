import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import Organization from "../organization/organization.entity";
import PlatformCustomerGroup from "../organization/platform/customer/customer_group.entity";
import OrganizationCustomerGroup from "../organization/customer/customer_group.entity";
import UserRoles from "./user_roles.entity";

export enum EUserType {
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE"
}

@Entity()
@Unique("uniqe_email_in_organization", ["email", "organization"])
@Unique("uniqe_username_in_organization", ["username", "organization"])
class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "text", nullable: true })
  avatar: string;

  @Column({ type: "text", nullable: true })
  password: string;

  @Column({ type: "text", nullable: true })
  verificationCode?: string;

  @Column({ type: "boolean", default: false })
  isVerified?: boolean;

  @Column({ type: "text", nullable: true })
  username: string;

  @Column({ type: "enum", enum: EUserType })
  type: EUserType;

  @OneToMany(() => UserRoles, ur => ur.user, { onDelete: "CASCADE" })
  roles?: UserRoles[]

  @ManyToOne(() => PlatformCustomerGroup, { onDelete: "SET NULL" })
  platformCustomerGroup?: PlatformCustomerGroup;

  @ManyToOne(() => OrganizationCustomerGroup, { onDelete: "SET NULL" })
  customerGroup?: OrganizationCustomerGroup;

  @ManyToOne(() => Organization, { onDelete: "SET NULL" })
  organization?: Organization;
}

export default Users;
