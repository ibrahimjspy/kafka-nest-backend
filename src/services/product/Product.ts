import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { fetchProductId } from 'src/postgres/handlers/product';
import { productCDC } from 'src/types/Product';
import { TransformerService } from '../transformer/Transformer';
/**
 *  Injectable class handling product and its relating tables CDC
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
    if (productExistsInDestination) {
      // await this.productModelTransformerClass.productTransformer(kafkaMessage);
      return updateProductHandler(kafkaMessage, productExistsInDestination);
    }
    return await createProductHandler(kafkaMessage);
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
