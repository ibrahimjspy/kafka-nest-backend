import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryService } from './services/category/Category';
import { ProductService } from './services/product/Product';
import { TransformerService } from './services/transformer/Transformer';

@Module({
  imports: [KafkaModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ProductService, TransformerService, CategoryService],
})
export class AppModule {}
