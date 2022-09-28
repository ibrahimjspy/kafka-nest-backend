import { Injectable } from '@nestjs/common';
import { createProductHandler } from 'src/graphql/handlers/createProduct';
import { updateProduct } from 'src/graphql/handlers/updateProduct';
import { ProductModelTransformService } from 'src/streams/product_model';
import { fetchMsSql } from 'src/utils/fetchProductView';
import { productExistenceCheckHandler } from 'src/utils/productExistingCheck';
@Injectable()
export class ProductService {
  constructor(
    private readonly transformService: ProductModelTransformService,
  ) {}
  public getHello(): string {
    return 'Hello World!';
  }
  public async handleProductCDC(kafkaMessage) {
    const productExistsInSaleor = await productExistenceCheckHandler(
      kafkaMessage,
    );
    const productAdditionalData = await fetchMsSql(kafkaMessage.TBItem_ID);
    const productCompositeData = Object.assign(
      productAdditionalData,
      kafkaMessage,
      productExistsInSaleor,
    );
    if (productExistsInSaleor.exists) {
      await this.productModelTransformerService.productTransform(
        productCompositeData,
      );
      return updateProduct(productCompositeData);
    }
    return createProductHandler(productAdditionalData);
  }
}
