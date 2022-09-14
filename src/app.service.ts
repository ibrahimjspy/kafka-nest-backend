import { Injectable } from '@nestjs/common';
import { createProductCatalog } from './graphql/handlers/createProduct';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  addProductCatalog(kafkaMessage) {
    return createProductCatalog(kafkaMessage) ;
  }
}
