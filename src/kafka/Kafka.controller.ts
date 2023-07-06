/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Inject, forwardRef } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ProducerService } from './Kafka.producer.service';
import { ProducerRecord } from 'kafkajs';
import {
  KAFKA_CREATE_PRODUCTS_TOPIC,
  KAFKA_SYNC_VENDOR_PRODUCTS_TOPIC,
} from './Kafka.constants';
import { AppService } from 'src/app.service';

@Controller()
export class KafkaController {
  constructor(
    @Inject(forwardRef(() => AppService))
    private readonly productService: AppService,
  ) {}
  private readonly logger = new Logger(KafkaController.name);

  @MessagePattern(KAFKA_CREATE_PRODUCTS_TOPIC)
  async createProducts(@Payload() message) {
    try {
      this.logger.log('received product import message');
      const bulkCreate = this.productService.productBulkCreate(
        message,
        message.operation,
      );
      return bulkCreate;
    } catch (error) {
      this.logger.error(error);
    }
  }

  @MessagePattern(KAFKA_SYNC_VENDOR_PRODUCTS_TOPIC)
  async syncVendorProducts(@Payload() message) {
    try {
      this.logger.log('received sync vendor products message');
      const vendorSync = this.productService.syncVendorProducts(message);
      return vendorSync;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
