import Users from "../../modules/auth/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Tokens {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "text", nullable: false })
  refreshToken: string;

  @Column({ type: "boolean" })
  isValid: boolean;

  @Column({ type: "timestamp" })
  expiresAt: Date;

  @ManyToOne(() => Users)
  user: Users;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @DeleteDateColumn({ type: "timestamp" })
  deletedAt: Date;
}

export default Tokens;
