import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    await this.ensureDemoUser(
      'student@school.com',
      'password123',
      'Student',
      'Demo',
      UserRole.STUDENT,
    );
    await this.ensureDemoUser(
      'counselor@school.com',
      'password123',
      'Counselor',
      'Demo',
      UserRole.COUNSELOR,
    );
    await this.ensureDemoUser(
      'admin@school.com',
      'password123',
      'Admin',
      'Demo',
      UserRole.ADMIN,
    );
  }

  private async ensureDemoUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: UserRole,
  ): Promise<void> {
    const existing = await this.usersRepository.findOne({ where: { email } });

    if (!existing) {
      const user = this.usersRepository.create({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      await this.usersRepository.save(user);
      this.logger.log(`Seeded demo user: ${email}`);
      return;
    }

    const hasPassword = await bcrypt.compare(password, existing.password);
    const needsUpdate =
      !hasPassword ||
      existing.firstName !== firstName ||
      existing.lastName !== lastName ||
      existing.role !== role;

    if (!needsUpdate) {
      return;
    }

    existing.password = await bcrypt.hash(password, 10);
    existing.firstName = firstName;
    existing.lastName = lastName;
    existing.role = role;
    await this.usersRepository.save(existing);
    this.logger.log(`Refreshed demo user: ${email}`);
  }
}
