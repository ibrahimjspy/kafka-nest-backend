import { Injectable } from '@nestjs/common';
import { createProductHandler } from 'src/graphql/handlers/createProduct';
import { updateProduct } from 'src/graphql/handlers/updateProduct';
import { ProductModelTransformerService } from 'src/streams/ProductTransformer';
import { productExistingInterface } from 'src/types/Product';
import { fetchAdditionalProductData } from 'src/utils/fetchProductView';
import { productExistenceCheckHandler } from 'src/utils/productExistingCheck';
@Injectable()
export class ProductService {
  constructor(
    private readonly productModelTransformerService: ProductModelTransformerService,
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
      await this.productModelTransformerService.productTransformer(
        productCompositeData,
      );
      return updateProduct(productCompositeData);
    }
    return createProductHandler(productAdditionalData);
  }
}
