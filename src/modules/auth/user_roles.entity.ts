import Roles from "../../providers/roles/role.entity";
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Users from "./user.entity";

@Entity("user_roles")
class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Roles)
  role: Roles

  @ManyToOne(() => Users)
  user: Users;
}

export default UserRoles;
