import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import Company from "./company.entity";
import { EUserPosition } from "./user/company_user.entity";

@Entity("invitations")
class Invitations {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({ type: "text", nullable: false })
  email: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'text', enum: EUserPosition })
  position: EUserPosition;

  @Column({ type: 'text', nullable: false })
  inviteToken: string;
}

export default Invitations;
