import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { ProblemIngestionModule } from './problem-ingestion/problem-ingestion.module';
import { SessionModule } from './session/session.module';
import { HealthController } from './health.controller';

@Module({
  imports: [SessionModule, ProblemIngestionModule, AiModule],
  controllers: [HealthController],
})
export class AppModule {}
