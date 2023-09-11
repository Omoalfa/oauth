import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import CompanyUsers from "./user/company_user.entity";
import Customers from "./customer/customer.entity";
import Users from "../user/user.entity";

@Entity("company")
class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", unique: true })
  email: string;

  @Column({ type: "text", unique: true })
  website: string;

  @Column({ type: "text" })
  name: string;

  @OneToMany(() => CompanyUsers, (cu) => cu.company)
  users: CompanyUsers[];

  @OneToMany(() => Customers, (c) => c.company)
  customers: Customers[];

  @ManyToOne(() => Users)
  owner: Users;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}

export default Company;
