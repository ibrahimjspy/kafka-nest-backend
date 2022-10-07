import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { fetchProductId } from 'src/postgres/handlers/product';
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
    console.log(kafkaMessage);
    const productExistsInDestination = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    if (productExistsInDestination) {
      // await this.productModelTransformerClass.productTransformer(kafkaMessage);
      return updateProductHandler(kafkaMessage, productExistsInDestination);
    }
    return await createProductHandler(kafkaMessage);
  }

  public async handleProductCDCDelete(kafkaMessage): Promise<object> {
    const productExistsInDestination = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    if (productExistsInDestination) {
      return deleteProductHandler(kafkaMessage.TBItem_ID);
    }
    return;
  }
}
