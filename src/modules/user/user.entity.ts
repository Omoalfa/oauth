import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import CompanyUsers from "../company/user/company_user.entity";
import Customers from "../company/customer/customer.entity";
import Company from "../company/company.entity";
import { EScopes } from "../company/user/scopes";

@Entity("user")
class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'text' })
  email: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'text', nullable: true })
  verificationCode: string;

  @ManyToOne(() => Company, { nullable: true })
  currentCompany: Company;

  @Column({ type: 'text', array: true, nullable: true })
  currentCompanyScopes: EScopes[]

  @OneToMany(() => CompanyUsers, (cu) => cu.user)
  employers: CompanyUsers[];

  @OneToMany(() => Customers, (c) => c.user)
  vendors: Customers[];
}

export default Users;
