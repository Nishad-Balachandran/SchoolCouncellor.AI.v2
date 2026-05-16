import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.usersRepository.find();
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateData: Partial<User>) {
    await this.usersRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    await this.usersRepository.delete(id);
    return user;
  }

  async getCounselors() {
    return this.usersRepository.find({
      where: { role: 'counselor' },
    });
  }

  async getStudents() {
    return this.usersRepository.find({
      where: { role: 'student' },
    });
  }
}
