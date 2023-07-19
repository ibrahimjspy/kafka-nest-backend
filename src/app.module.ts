import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { ShippingService } from './services/shop/shipping/Shipping.Service';
import { UserService } from './services/shop/user/User.Service';
import { RetailerService } from './services/shop/retailer/Retailer.Service';
import { RetailerTransformerService } from './transformer/shop/Retailer.transformer';
import { LoggerModule } from './logger/Logger.module';
import { ProducerService } from './kafka/Kafka.producer.service';
import { KafkaController } from './kafka/Kafka.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle, OpenBundle } from './database/postgres/tables/Bundle';
import { BundleRepository } from './database/repository/Bundle';
import {
  BundleProductVariant,
  OpenBundleProductVariant,
} from './database/postgres/tables/BundleVariants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransformerModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [
          Bundle,
          OpenBundle,
          BundleProductVariant,
          OpenBundleProductVariant,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Bundle]),
    TypeOrmModule.forFeature([OpenBundle]),
    TypeOrmModule.forFeature([BundleProductVariant]),
    TypeOrmModule.forFeature([OpenBundleProductVariant]),
  ],
  controllers: [AppController, BulkImportController, KafkaController],
  providers: [
    AppService,
    Logger,
    ProductService,
    CategoryService,
    TransformerService,
    ShopService,
    ProductMediaService,
    ProductVariantService,
    ShippingService,
    UserService,
    RetailerService,
    RetailerTransformerService,
    ProducerService,
    Bundle,
    OpenBundle,
    BundleProductVariant,
    OpenBundleProductVariant,
    BundleRepository,
  ],
})
export class AppModule {}
