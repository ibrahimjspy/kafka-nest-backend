import { Module } from '@nestjs/common';
import { CategoryTransformerService } from './category/Category.transformer';
import { ProductTransformerService } from './product/Product.transformer';
import { RetailerTransformerService } from './shop/Retailer.transformer';
import { ShopTransformerService } from './shop/Shop.transformer';
import { TransformerService } from './Transformer.service';

@Module({
  providers: [
    TransformerService,
    ProductTransformerService,
    CategoryTransformerService,
    ShopTransformerService,
    RetailerTransformerService,
  ],
  exports: [
    TransformerService,
    ProductTransformerService,
    CategoryTransformerService,
    ShopTransformerService,
  ],
})
export class TransformerModule {}
