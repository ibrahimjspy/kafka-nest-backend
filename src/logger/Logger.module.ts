import { Module } from '@nestjs/common';
import { ApplicationLogger } from './Logger.service';

@Module({
  providers: [ApplicationLogger],
  exports: [ApplicationLogger],
})
export class LoggerModule {}
