import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Users from '../auth/user.entity';

export enum EOrganizationType {
  PLATFORM = 'PLATFORM',
  CLIENT = 'CLIENT',
}

@Entity('organization')
class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  website: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'enum', enum: EOrganizationType })
  type: EOrganizationType;

  @OneToMany(() => Users, (e) => e.organization)
  users?: Users[];

  @ManyToOne(() => Users)
  @JoinColumn()
  owner?: Users;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}

export default Organization;
