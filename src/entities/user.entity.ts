import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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

  @Column({ type: 'text', enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;
}

export default Users;
