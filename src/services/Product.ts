import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { ProductTransformer } from 'src/streams/ProductTransformer';
import { productExistingInterface } from 'src/types/product';
import { fetchAdditionalProductData } from 'src/utils/fetchProductView';
import { productExistenceCheckHandler } from 'src/utils/productExistingCheck';

@Injectable()
export class ProductService {
  constructor(
    private readonly productModelTransformerClass: ProductTransformer,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async handleProductCDC(kafkaMessage): Promise<object> {
    const productExistsInDestination: productExistingInterface =
      await productExistenceCheckHandler(kafkaMessage);
    const productAdditionalData: object = await fetchAdditionalProductData(
      kafkaMessage.TBItem_ID,
    );
    const productCompositeData: object = Object.assign(
      productAdditionalData,
      kafkaMessage,
      productExistsInDestination,
    );
    if (productExistsInDestination.exists) {
      await this.productModelTransformerClass.productTransformer(
        productCompositeData,
      );
      return updateProductHandler(productCompositeData);
    }
    return createProductHandler(productAdditionalData);
  }
}
