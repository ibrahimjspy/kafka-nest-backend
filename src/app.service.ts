import { Injectable } from '@nestjs/common';
import { createProductMutationHandler } from './graphql/handlers/createProduct';
import { ProducerService } from './kafka/producer.service';
import { seoMessageStream } from './streams/seo';
@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}
  getHello(): string {
    return 'Hello World!';
  }
  public addProductCatalog(kafkaMessage) {
    console.log(kafkaMessage);
    return createProductMutationHandler(kafkaMessage, kafkaMessage.op);
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
