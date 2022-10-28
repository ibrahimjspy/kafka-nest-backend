import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryService } from './services/category/Category.Service';
import { ProductMediaService } from './services/product/media/Product.Media.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
import { TransformerModule } from './transformer/Transformer.module';
import { TransformerService } from './transformer/Transformer.service';

@Module({
  imports: [KafkaModule, ConfigModule.forRoot(), TransformerModule],
  controllers: [AppController],
  providers: [
    AppService,
    ProductService,
    CategoryService,
    TransformerService,
    ShopService,
    ProductMediaService,
    ProductVariantService,
  ],
})
export class AppModule {}
