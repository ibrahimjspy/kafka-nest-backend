import { Module } from '@nestjs/common';
import { CategoryTransformerService } from './services/category/Category.service';
import { ProductTransformerService } from './services/product/Product.service';
import { ShopTransformerService } from './services/shop/Shop.service';
import { TransformerService } from './Transformer.service';

@Module({
  providers: [
    TransformerService,
    ProductTransformerService,
    CategoryTransformerService,
    ShopTransformerService,
  ],
  exports: [
    TransformerService,
    ProductTransformerService,
    CategoryTransformerService,
    ShopTransformerService,
  ],
})
export class TransformerModule {}
