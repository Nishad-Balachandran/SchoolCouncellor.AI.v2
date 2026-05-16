import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { SessionMessage } from './session-message.entity';

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

@Entity('counseling_sessions')
export class CounselingSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  studentId: string;

  @Column({ nullable: true })
  counselorId: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.ACTIVE })
  status: SessionStatus;

  @Column({ type: 'json', nullable: true })
  aiContext: Record<string, any>;

  @Column({ type: 'text', array: true, nullable: true })
  goals: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.studentSessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ManyToOne(() => User, (user) => user.counselorSessions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'counselorId' })
  counselor: User;

  @OneToMany(() => SessionMessage, (message) => message.session)
  messages: SessionMessage[];
}
