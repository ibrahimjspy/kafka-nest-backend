import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { productExistingInterface } from 'src/types/product';
import { fetchAdditionalProductData } from 'src/utils/fetchProductView';
import { productExistenceCheckHandler } from 'src/utils/productExistingCheck';
import { TransformerService } from '../transformer/Transformer';
/**
 *  Injectable class handling product and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly productModelTransformerClass: TransformerService,
  ) {}

  public healthCheck(): string {
    return 'Service running';
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
