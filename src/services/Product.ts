import { Injectable } from '@nestjs/common';
import { createProductHandler } from 'src/graphql/handlers/createProduct';
import { updateProduct } from 'src/graphql/handlers/updateProduct';
import { productCheckHandler } from 'src/utils/productExistingCheck';
import { testProductData } from 'test/product';
@Injectable()
export class ProductService {
  getHello(): string {
    return 'Hello World!';
  }
  public async handleProductChange(kafkaMessage) {
    const productExists = await productCheckHandler(kafkaMessage.after);
    const productData = Object.assign(
      testProductData,
      kafkaMessage,
      productExists,
    );
    if (productExists.exists) {
      return createProductHandler(productData);
    }
    return updateProduct(productData);
  }
}
