import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BulkImportController } from './api/Import.Controller';
import { CategoryService } from './services/category/Category.Service';
import { ProductMediaService } from './services/product/media/Product.Media.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
import { TransformerModule } from './transformer/Transformer.module';
import { TransformerService } from './transformer/Transformer.service';
import { ProducerService } from './kafka/producer.service';
import { KafkaModule } from './kafka/kafka.module';
import { BulkImportService } from './api/import.service';

@Module({
  imports: [ConfigModule.forRoot(), TransformerModule, KafkaModule],
  controllers: [AppController, BulkImportController],
  providers: [
    AppService,
    BulkImportService,
    ProducerService,
    ProductService,
    CategoryService,
    TransformerService,
    ShopService,
    ProductMediaService,
    ProductVariantService,
  ],
})
export class AppModule {}
