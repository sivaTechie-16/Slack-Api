import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class LunchCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  response: string;

  @Column({ nullable: true, default: null })
  amount: number;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @ManyToOne(() => User, (user) => user.lunchCounts)
  user: User;
}
