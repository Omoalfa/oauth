import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import Organization from '../../modules/organization/organization.entity';

@Entity('roles')
@Unique('unique_title_per_owner', ['title', 'owner'])
class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'text' })
  scopes: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @ManyToOne(() => Organization)
  @JoinColumn()
  owner: Organization;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}

export default Roles;
