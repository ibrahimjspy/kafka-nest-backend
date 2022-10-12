import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { fetchProductId } from 'src/postgres/handlers/product';
import { productCDC } from 'src/types/Product';
import { TransformerService } from '../transformer/Service';
/**
 *  Injectable class handling product variant and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductService {
  constructor(private readonly transformerClass: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }

  public async handleProductCDC(kafkaMessage: productCDC): Promise<object> {
    // console.log(kafkaMessage);
    const productExistsInDestination: string = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    const productData = await this.transformerClass.generalTransformer(
      kafkaMessage,
    );
    if (productExistsInDestination) {
      return updateProductHandler(productData, productExistsInDestination);
    }
    return await createProductHandler(productData);
  }

  public async handleProductCDCDelete(
    kafkaMessage: productCDC,
  ): Promise<object> {
    const productExistsInDestination: string = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    if (productExistsInDestination) {
      return deleteProductHandler(kafkaMessage.TBItem_ID);
    }
    return;
  }
}
