import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerService } from './kafka/producer.service';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, ProducerService],
})
export class AppModule {}
