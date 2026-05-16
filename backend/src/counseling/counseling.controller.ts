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
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CounselingService } from './counseling.service';
import { MessageRole } from '../entities/session-message.entity';
import { UserRole } from '../entities/user.entity';

@Controller('counseling')
export class CounselingController {
  constructor(private counselingService: CounselingService) {}

  @Post('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async createSession(@Request() req) {
    return this.counselingService.createSession(req.user.id);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Request() req) {
    return this.counselingService.getSessionsForUser(req.user.id, req.user.role);
  }

  @Get('sessions/queue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COUNSELOR)
  async getCounselorQueue() {
    return this.counselingService.getUnassignedSessions();
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getSession(@Request() req, @Param('id') id: string) {
    return this.counselingService.getSessionForUser(id, req.user.id, req.user.role);
  }

  @Post('sessions/:id/claim')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COUNSELOR)
  async claimSession(@Request() req, @Param('id') sessionId: string) {
    return this.counselingService.claimSession(sessionId, req.user.id);
  }

  @Post('sessions/:id/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  async addMessage(
    @Request() req,
    @Param('id') sessionId: string,
    @Body() body: { content: string },
  ) {
    return this.counselingService.addMessage(
      sessionId,
      req.user.id,
      MessageRole.USER,
      body.content,
    );
  }

  @Post('sessions/:id/counselor-message')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.COUNSELOR)
  async addCounselorMessage(
    @Request() req,
    @Param('id') sessionId: string,
    @Body() body: { content: string },
  ) {
    return this.counselingService.addMessage(
      sessionId,
      req.user.id,
      MessageRole.COUNSELOR,
      body.content,
    );
  }

  @Get('sessions/:id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Request() req, @Param('id') sessionId: string) {
    return this.counselingService.getSessionMessages(sessionId, req.user.id, req.user.role);
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
