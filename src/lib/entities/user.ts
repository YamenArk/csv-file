import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn} from 'typeorm';

import { Job } from './job';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true }) 
  fcmToken: string | null;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Job, job => job.user, { onDelete: 'CASCADE' })
  public job: Job[];
}
