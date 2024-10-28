import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LunchCount } from "./lunchCount";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  slackId: string;

  @OneToMany(() => LunchCount, (lunchCount) => lunchCount.user)
  lunchCounts: LunchCount[];
}
