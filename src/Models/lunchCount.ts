import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()

@Entity()
export class LunchCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  response: string;

  @Column({ type: "timestamp" })
  timestamp: Date;
}
