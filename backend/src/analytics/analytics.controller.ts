import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('student')
  @UseGuards(JwtAuthGuard)
  async getStudentAnalytics(@Request() req) {
    return this.analyticsService.getStudentAnalytics(req.user.id);
  }

  @Get('counselor')
  @UseGuards(JwtAuthGuard)
  async getCounselorAnalytics(@Request() req) {
    return this.analyticsService.getCounselorAnalytics(req.user.id);
  }

  @Get('trends')
  @UseGuards(JwtAuthGuard)
  async getMonthlyTrends() {
    return this.analyticsService.getMonthlyTrends();
  }
}
