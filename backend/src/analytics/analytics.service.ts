import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CounselingSession, SessionStatus } from '../entities/counseling-session.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(CounselingSession)
    private sessionsRepository: Repository<CounselingSession>,
  ) {}

  async getDashboardStats() {
    const totalSessions = await this.sessionsRepository.count();
    const activeSessions = await this.sessionsRepository.count({
      where: { status: SessionStatus.ACTIVE },
    });
    const completedSessions = await this.sessionsRepository.count({
      where: { status: SessionStatus.COMPLETED },
    });

    return {
      totalSessions,
      activeSessions,
      completedSessions,
      completionRate:
        totalSessions > 0
          ? ((completedSessions / totalSessions) * 100).toFixed(2)
          : 0,
    };
  }

  async getStudentAnalytics(studentId: string) {
    const sessions = await this.sessionsRepository.find({
      where: { studentId },
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(
      (s) => s.status === SessionStatus.COMPLETED,
    ).length;

    return {
      studentId,
      totalSessions,
      completedSessions,
      activeSessions: totalSessions - completedSessions,
      completionRate:
        totalSessions > 0
          ? ((completedSessions / totalSessions) * 100).toFixed(2)
          : 0,
      averageGoals: sessions.reduce(
        (sum, s) => sum + (s.goals?.length || 0),
        0,
      ),
    };
  }

  async getCounselorAnalytics(counselorId: string) {
    const sessions = await this.sessionsRepository.find({
      where: { counselorId },
    });

    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(
      (s) => s.status === SessionStatus.COMPLETED,
    ).length;

    return {
      counselorId,
      totalSessions,
      completedSessions,
      activeSessions: totalSessions - completedSessions,
      completionRate:
        totalSessions > 0
          ? ((completedSessions / totalSessions) * 100).toFixed(2)
          : 0,
    };
  }

  async getMonthlyTrends() {
    const sessions = await this.sessionsRepository.find();

    const monthlyData: Record<string, number> = {};
    sessions.forEach((session) => {
      const month = session.createdAt.toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    return monthlyData;
  }
}
