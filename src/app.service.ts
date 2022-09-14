import { Injectable } from '@nestjs/common';
import { createProduct } from './graphql/handlers/createProduct';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  addProduct(kafkaMessage) {
    return createProduct(kafkaMessage) ;
  }
}
