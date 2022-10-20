import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { mediaMock } from 'src/mock/product/media';
import { fetchProductId } from 'src/postgres/handlers/product';
import { productCDC, productCreate } from 'src/types/product';
import { TransformerService } from '../transformer/Service';
import { ProductMediaService } from './media/Service';
/**
 *  Injectable class handling product variant and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductService {
  constructor(
    private readonly transformerClass: TransformerService,
    private readonly productMediaClass: ProductMediaService,
  ) {}

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
    // updating product with cdc information
    if (productExistsInDestination) {
      return updateProductHandler(productData, productExistsInDestination);
    }
    // creating new product and assigning it media
    const product: productCreate = await createProductHandler(productData);
    if (product.productCreate) {
      await this.productMediaClass.productMediaAssign(
        mediaMock,
        product.productCreate.product.id,
      );
    }

    return { product };
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
