import { Logger, Module } from '@nestjs/common';
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
import { ShippingService } from './services/shop/shipping/Shipping.Service';
import { UserService } from './services/shop/user/User.Service';
import { RetailerService } from './services/shop/retailer/Retailer.Service';
import { RetailerTransformerService } from './transformer/shop/Retailer.transformer';

@Module({
  imports: [ConfigModule.forRoot(), TransformerModule],
  controllers: [AppController, BulkImportController],
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
  ],
})
export class AppModule {}
