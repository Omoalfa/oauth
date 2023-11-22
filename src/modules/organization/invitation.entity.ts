import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import Company from './organization.entity';

@Entity('invitations')
class Invitations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  email: string;

  @ManyToOne(() => Company)
  company: Company;

  @Column({ type: 'text', nullable: false })
  inviteToken: string;
}

export default Invitations;
