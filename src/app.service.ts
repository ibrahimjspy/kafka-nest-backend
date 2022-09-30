import { Injectable } from '@nestjs/common';
import { createProductHandler } from './graphql/handlers/createProduct';
import { ProducerService } from './kafka/producer.service';
import { ProductService } from './services/Product';
import { seoTransformer } from './transformers/seo';
@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly productService: ProductService,
  ) {}
  handleProductCDC(kafkaMessage) {
    return this.productService.handleProductCDC(kafkaMessage);
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
