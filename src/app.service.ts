import { Injectable } from '@nestjs/common';
import { createProductCatalog } from './graphql/handlers/createProduct';
import { ProducerService } from './kafka/producer.service';
import { seoMessageStream } from './streams/seo';
@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}
  getHello(): string {
    return 'Hello World!';
  }
  addProductCatalog(kafkaMessage) {
    console.log(kafkaMessage);
    return createProductCatalog({});
  }
  //kafka streams api method
  async addSeoStreamService(kafkaMessage) {
    const streamedMessage = await seoMessageStream(kafkaMessage);
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
