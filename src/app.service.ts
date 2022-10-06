import { Injectable } from '@nestjs/common';
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
    return this.productService.handleProductCDC(kafkaMessage);
  }
  handleMasterCategoryCDC(kafkaMessage) {
    return this.categoryService.handleMasterCategoryCDC(kafkaMessage);
  }
  handleSubCategoryCDC(kafkaMessage) {
    return this.categoryService.handleSubCategoryCDC(kafkaMessage);
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
