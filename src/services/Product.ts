import { Injectable } from '@nestjs/common';
import { createProductHandler } from 'src/graphql/handlers/createProduct';
import { updateProduct } from 'src/graphql/handlers/updateProduct';
import { fetchMsSql } from 'src/utils/fetchProductView';
import { productCheckHandler } from 'src/utils/productExistingCheck';
@Injectable()
export class ProductService {
  public getHello(): string {
    return 'Hello World!';
  }
  public async handleProductApi(kafkaMessage) {
    const productExistsInSaleor = await productCheckHandler(kafkaMessage);
    const productAdditionalData = await fetchMsSql(kafkaMessage.TBItem_ID);
    const productCompositeData = Object.assign(
      productAdditionalData,
      kafkaMessage,
      productExistsInSaleor,
    );
    if (productExistsInSaleor.exists) {
      return updateProduct(productCompositeData);
    }
    return createProductHandler(productCompositeData);
  }
}
