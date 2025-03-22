import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
import { User } from './user';

@Entity({ name: 'job' })
export class Job {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'enum', enum: ['pending', 'success','failed'] })
    status: 'pending' | 'success'|'failed';
  
    @Column({ nullable: true }) 
    fileName: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.job, { onDelete: 'CASCADE' })
    public user: User
}