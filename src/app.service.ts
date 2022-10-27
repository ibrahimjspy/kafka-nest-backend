import { Injectable, Logger } from '@nestjs/common';
import { createProductHandler } from './graphql/handlers/product';
import { ProducerService } from './kafka/producer.service';
import { CategoryService } from './services/category/Category.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
    private readonly productVariantService: ProductVariantService,
  ) {}

  handleProductCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.productService.handleProductCDCDelete(kafkaMessage.before)
        : this.productService.handleProductCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('product deleted');
    }
  }

  handleMasterCategoryCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.categoryService.handleMasterCategoryCDCDelete(
            kafkaMessage.before,
          )
        : this.categoryService.handleMasterCategoryCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('category deleted');
    }
  }

  handleSubCategoryCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.categoryService.handleSubCategoryCDCDelete(kafkaMessage.before)
        : this.categoryService.handleSubCategoryCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('category deleted');
    }
  }
  public addProductCatalog(kafkaMessage) {
    return createProductHandler(kafkaMessage);
  }

  handleShopCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.shopService.handleShopCDCDelete(kafkaMessage.before)
        : this.shopService.handleShopCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('shop deleted');
    }
  }

  handleSelectColorCDC(kafkaMessage) {
    try {
      return kafkaMessage.op !== 'd'
        ? this.productVariantService.handleSelectColorCDC(kafkaMessage.after)
        : '';
    } catch (error) {
      Logger.log('variant deleted');
    }
  }

  //kafka streams api method
  async addSeoStreamService(kafkaMessage) {
    Logger.log(kafkaMessage);
    await this.producerService.produce({
      topic: 'seo_details',
      messages: [
        {
          value: 'test',
        },
      ],
    });
    return 'seo stream method called';
  }
}
