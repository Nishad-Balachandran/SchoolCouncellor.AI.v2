import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { CounselingSession } from './counseling-session.entity';
import { Appointment } from './appointment.entity';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  COUNSELOR = 'counselor',
  STUDENT = 'student',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true })
  schoolId: string;

  @Column({ nullable: true })
  department: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => CounselingSession,
    (session) => session.student,
  )
  studentSessions: CounselingSession[];

  @OneToMany(
    () => CounselingSession,
    (session) => session.counselor,
  )
  counselorSessions: CounselingSession[];

  @OneToMany(() => Appointment, (appointment) => appointment.student)
  studentAppointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.counselor)
  counselorAppointments: Appointment[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
