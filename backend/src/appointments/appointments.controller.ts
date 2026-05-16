import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAppointment(
    @Request() req,
    @Body() body: { counselorId: string; scheduledTime: Date },
  ) {
    return this.appointmentsService.create(
      req.user.id,
      body.counselorId,
      body.scheduledTime,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAppointments(@Request() req) {
    return this.appointmentsService.getStudentAppointments(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointment(id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelAppointment(@Param('id') id: string) {
    return this.appointmentsService.cancelAppointment(id);
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  async completeAppointment(
    @Param('id') id: string,
    @Body() body: { counselorNotes: string },
  ) {
    return this.appointmentsService.completeAppointment(
      id,
      body.counselorNotes,
    );
  }
}
