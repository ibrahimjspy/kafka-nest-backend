import { Injectable } from '@nestjs/common';
import { createProductMutationHandler } from 'src/graphql/handlers/createProduct';
import { kafkaMessageCheck } from 'src/utils/kafkaMessageNature';
import { testProductData } from 'test/product';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  public async addProductCatalog(kafkaMessage) {
    const message_nature = kafkaMessageCheck(kafkaMessage);
    const productData = Object.assign(testProductData, kafkaMessage);
    return createProductMutationHandler(productData, message_nature);
  }
  //kafka streams api method
}
