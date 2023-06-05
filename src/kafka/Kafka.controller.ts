/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Inject, forwardRef } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ProducerService } from './Kafka.producer.service';
import { ProducerRecord } from 'kafkajs';
import { KAFKA_CREATE_PRODUCTS_TOPIC } from './Kafka.constants';
import { AppService } from 'src/app.service';

@Controller()
export class KafkaController {
  constructor(
    @Inject(forwardRef(() => AppService))
    private readonly productService: AppService,
  ) {}
  private readonly logger = new Logger(KafkaController.name);

  @MessagePattern(KAFKA_CREATE_PRODUCTS_TOPIC)
  async autoSyncCreateBatches(@Payload() message) {
    try {
      this.logger.log('received product import message');
      const bulkCreate = await this.productService.handleProductBulkCreateCDC(
        message,
      );
      return bulkCreate;
    } catch (error) {
      this.logger.error(error);
    }
  }
}