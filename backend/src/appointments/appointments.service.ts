import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async create(studentId: string, counselorId: string, scheduledTime: Date) {
    const appointment = this.appointmentsRepository.create({
      studentId,
      counselorId,
      scheduledTime,
      status: AppointmentStatus.SCHEDULED,
    });
    return this.appointmentsRepository.save(appointment);
  }

  async getStudentAppointments(studentId: string) {
    return this.appointmentsRepository.find({
      where: { studentId },
      relations: ['counselor'],
      order: { scheduledTime: 'DESC' },
    });
  }

  async getCounselorAppointments(counselorId: string) {
    return this.appointmentsRepository.find({
      where: { counselorId },
      relations: ['student'],
      order: { scheduledTime: 'DESC' },
    });
  }

  async getAppointment(id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['student', 'counselor'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async updateAppointment(id: string, updateData: Partial<Appointment>) {
    await this.appointmentsRepository.update(id, updateData);
    return this.getAppointment(id);
  }

  async cancelAppointment(id: string) {
    const appointment = await this.getAppointment(id);
    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }

  async completeAppointment(id: string, counselorNotes: string) {
    const appointment = await this.getAppointment(id);
    appointment.status = AppointmentStatus.COMPLETED;
    appointment.counselorNotes = counselorNotes;
    return this.appointmentsRepository.save(appointment);
  }
}
