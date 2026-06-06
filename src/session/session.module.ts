import { Module } from '@nestjs/common';
import { SessionStorageService } from './session-storage.service';

@Module({
  providers: [SessionStorageService],
  exports: [SessionStorageService],
})
export class SessionModule {}
