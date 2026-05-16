import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounselingSession } from '../entities/counseling-session.entity';
import { SessionMessage } from '../entities/session-message.entity';
import { MessageRole, SessionStatus } from '../entities/session-message.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CounselingService {
  constructor(
    @InjectRepository(CounselingSession)
    private sessionsRepository: Repository<CounselingSession>,
    @InjectRepository(SessionMessage)
    private messagesRepository: Repository<SessionMessage>,
    private aiService: AiService,
  ) {}

  async createSession(studentId: string) {
    const session = this.sessionsRepository.create({
      studentId,
      status: SessionStatus.ACTIVE,
    });
    return this.sessionsRepository.save(session);
  }

  async getSessionsByStudent(studentId: string) {
    return this.sessionsRepository.find({
      where: { studentId },
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId },
      relations: ['messages'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async addMessage(sessionId: string, role: MessageRole, content: string) {
    const session = await this.getSession(sessionId);

    const message = this.messagesRepository.create({
      sessionId,
      role,
      content,
    });

    await this.messagesRepository.save(message);

    // If user message, get AI response
    if (role === MessageRole.USER) {
      const conversationHistory = session.messages || [];
      const aiResponse = await this.aiService.generateResponse(
        content,
        conversationHistory,
      );

      const aiMessage = this.messagesRepository.create({
        sessionId,
        role: MessageRole.AI,
        content: aiResponse,
      });

      await this.messagesRepository.save(aiMessage);
      return { userMessage: message, aiMessage };
    }

    return message;
  }

  async completeSession(sessionId: string, summary?: string) {
    const session = await this.getSession(sessionId);
    session.status = SessionStatus.COMPLETED;
    if (summary) {
      session.summary = summary;
    }
    return this.sessionsRepository.save(session);
  }

  async getSessionMessages(sessionId: string) {
    return this.messagesRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }
}
