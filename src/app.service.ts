import { Injectable } from '@nestjs/common';
import { createProductHandler } from './graphql/handlers/createProduct';
import { ProducerService } from './kafka/producer.service';
import { ProductService } from './services/Product';
import { ProductModelTransformerService } from './streams/ProductTransformer';
import { seoTransformer } from './transformers/seo';
@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private readonly productService: ProductService,
    private readonly productTransformService: ProductModelTransformerService,
  ) {}
  handleProductCDC(kafkaMessage) {
    return this.productService.handleProductApi(kafkaMessage);
  }
  public addProductCatalog(kafkaMessage) {
    console.log(kafkaMessage);
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
