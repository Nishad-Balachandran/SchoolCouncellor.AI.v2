import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CounselingService } from './counseling.service';
import { CounselingController } from './counseling.controller';
import { CounselingSession } from '../entities/counseling-session.entity';
import { SessionMessage } from '../entities/session-message.entity';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CounselingSession, SessionMessage]),
    AuthModule,
    AiModule,
  ],
  controllers: [CounselingController],
  providers: [CounselingService],
  exports: [CounselingService],
})
export class CounselingModule {}
