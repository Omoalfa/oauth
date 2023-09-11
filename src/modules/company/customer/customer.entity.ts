import Users from "@/modules/user/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Company from "../company.entity";

@Entity("company_customers")
class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  
  @ManyToOne(() => Users)
  user: Users;

  @ManyToOne(() => Company)
  company: Company;
}

export default Customers;
