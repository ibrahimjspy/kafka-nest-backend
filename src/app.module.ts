import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryService } from './services/category/Service';
import { ProductMediaService } from './services/product/media/Service';
import { ProductService } from './services/product/Service';
import { ShopService } from './services/shop/Service';
import { TransformerService } from './services/transformer/Service';

@Module({
  imports: [KafkaModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    ProductService,
    TransformerService,
    CategoryService,
    ShopService,
    ProductMediaService,
  ],
})
export class AppModule {}
