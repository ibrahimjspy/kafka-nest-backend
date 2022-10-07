import { Injectable, Logger } from '@nestjs/common';
import { createProductHandler } from './graphql/handlers/product';
import { ProducerService } from './kafka/producer.service';
import { CategoryService } from './services/category/Category';
import { ProductService } from './services/product/Product';
import { seoTransformer } from './transformers/seo';
@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
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

  //kafka streams api method
  async addSeoStreamService(kafkaMessage) {
    const streamedMessage = await seoTransformer(kafkaMessage);
    await this.producerService.produce({
      topic: 'seo_details',
      messages: [
        {
          value: streamedMessage,
        },
      ],
    });
    return 'seo stream method called';
  }
}
