import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CounselingService } from './counseling.service';
import { MessageRole } from '../entities/session-message.entity';

@Controller('counseling')
export class CounselingController {
  constructor(private counselingService: CounselingService) {}

  @Post('sessions')
  @UseGuards(JwtAuthGuard)
  async createSession(@Request() req) {
    return this.counselingService.createSession(req.user.id);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessionsByStudent(@Request() req) {
    return this.counselingService.getSessionsByStudent(req.user.id);
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getSession(@Param('id') id: string) {
    return this.counselingService.getSession(id);
  }

  @Post('sessions/:id/messages')
  @UseGuards(JwtAuthGuard)
  async addMessage(
    @Param('id') sessionId: string,
    @Body() body: { content: string },
  ) {
    return this.counselingService.addMessage(
      sessionId,
      MessageRole.USER,
      body.content,
    );
  }

  @Get('sessions/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('id') sessionId: string) {
    return this.counselingService.getSessionMessages(sessionId);
  }

  @Post('sessions/:id/complete')
  @UseGuards(JwtAuthGuard)
  async completeSession(
    @Param('id') sessionId: string,
    @Body() body: { summary?: string },
  ) {
    return this.counselingService.completeSession(sessionId, body.summary);
  }
}
