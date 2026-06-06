import { Module } from '@nestjs/common';
import { DsaMentorPromptService } from './dsa-mentor-prompt.service';

@Module({
  providers: [DsaMentorPromptService],
  exports: [DsaMentorPromptService],
})
export class AiModule {}
