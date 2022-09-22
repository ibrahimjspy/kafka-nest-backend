import { Injectable } from '@nestjs/common';
import { createProductMutationHandler } from 'src/graphql/handlers/createProduct';
import { kafkaMessageCheck } from 'src/utils/kafkaMessageNature';
import { productCheckHandler } from 'src/utils/productExistingCheck';
import { testProductData } from 'test/product';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  public async addProductCatalog(kafkaMessage) {
    const message_nature = kafkaMessageCheck(kafkaMessage);
    const productExists = await productCheckHandler(kafkaMessage.after);
    const productData = Object.assign(
      testProductData,
      kafkaMessage,
      productExists,
    );
    if (productExists.exists) {
      return createProductMutationHandler(productData, message_nature);
    }
    return createProductMutationHandler(productData, message_nature);
  }
}
