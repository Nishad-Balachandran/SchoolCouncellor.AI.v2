import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CounselingSession, SessionStatus } from '../entities/counseling-session.entity';
import { SessionMessage } from '../entities/session-message.entity';
import { MessageRole } from '../entities/session-message.entity';
import { AiService } from '../ai/ai.service';
import { UserRole } from '../entities/user.entity';

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
      relations: ['messages', 'counselor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSessionsForUser(userId: string, role: UserRole) {
    if (role === UserRole.COUNSELOR) {
      return this.sessionsRepository.find({
        where: { counselorId: userId },
        relations: ['messages', 'student', 'counselor'],
        order: { createdAt: 'DESC' },
      });
    }

    return this.sessionsRepository.find({
      where: { studentId: userId },
      relations: ['messages', 'counselor'],
      order: { createdAt: 'DESC' },
    });
  }

  async getUnassignedSessions() {
    return this.sessionsRepository.find({
      where: {
        counselorId: IsNull(),
        status: SessionStatus.ACTIVE,
      },
      relations: ['student', 'messages'],
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id: sessionId },
      relations: ['messages', 'student', 'counselor'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async getSessionForUser(sessionId: string, userId: string, role: UserRole) {
    const session = await this.getSession(sessionId);
    this.assertSessionAccess(session, userId, role);
    return session;
  }

  async claimSession(sessionId: string, counselorId: string) {
    const session = await this.getSession(sessionId);

    if (session.counselorId && session.counselorId !== counselorId) {
      throw new ConflictException('Session is already assigned to another counselor');
    }

    if (!session.counselorId) {
      session.counselorId = counselorId;
      await this.sessionsRepository.save(session);
    }

    return this.getSession(sessionId);
  }

  async addMessage(
    sessionId: string,
    actorId: string,
    role: MessageRole,
    content: string,
  ) {
    const session = await this.getSession(sessionId);

    if (role === MessageRole.USER && session.studentId !== actorId) {
      throw new ForbiddenException('Only the session student can send student messages');
    }

    if (role === MessageRole.COUNSELOR) {
      if (!session.counselorId) {
        throw new ForbiddenException('Session must be claimed before counselor reply');
      }
      if (session.counselorId !== actorId) {
        throw new ForbiddenException('Only assigned counselor can reply in this session');
      }
    }

    const message = this.messagesRepository.create({
      sessionId,
      role,
      content,
    });

    await this.messagesRepository.save(message);

    // If user message, get AI response
    if (role === MessageRole.USER && !session.counselorId) {
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

  async getSessionMessages(sessionId: string, userId: string, role: UserRole) {
    const session = await this.getSession(sessionId);
    this.assertSessionAccess(session, userId, role);

    return this.messagesRepository.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  private assertSessionAccess(
    session: CounselingSession,
    userId: string,
    role: UserRole,
  ) {
    if (role === UserRole.ADMIN) {
      return;
    }

    if (role === UserRole.STUDENT && session.studentId === userId) {
      return;
    }

    if (role === UserRole.COUNSELOR && session.counselorId === userId) {
      return;
    }

    throw new ForbiddenException('You do not have access to this counseling session');
  }
}
