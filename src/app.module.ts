import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ProductService } from './services/Product';
import { TransformerService } from './services/Transformer';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, ProductService, TransformerService],
})
export class AppModule {}
