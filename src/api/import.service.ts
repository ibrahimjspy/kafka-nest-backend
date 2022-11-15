import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class BulkImportService {
  constructor(private readonly producerService: ProducerService) {}
  //  creating demo messages in topic product
  async healthCheck() {
    await this.producerService.produce({
      topic: 'healthCheck',
      messages: [
        {
          value: 'kafka service running',
        },
      ],
    });
    return 'Hello World!';
  }
  async createBulkProducts() {
    await this.producerService.produce({
      topic: 'product_bulk_create',
      messages: [
        {
          value: 'create product',
        },
      ],
    });
    return 'Successfully sent message to kafka for product bulk create';
  }
  async createBulkShops() {
    await this.producerService.produce({
      topic: 'shop_bulk_create',
      messages: [
        {
          value: 'create shops',
        },
      ],
    });
    return 'Successfully sent message to kafka for shop bulk create';
  }
}
