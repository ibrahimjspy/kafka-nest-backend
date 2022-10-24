import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { mediaMock } from 'src/mock/product/media';
import {
  deleteProductId,
  fetchProductId,
  insertProductId,
} from 'src/postgres/handlers/product';
import {
  productDto,
  productCreate,
  productTransformed,
} from 'src/types/product';
import { TransformerService } from '../../transformer/Transformer.service';
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

  public async handleProductCDC(kafkaMessage: productDto): Promise<object> {
    const productExistsInDestination: string = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    const productData = await this.transformerClass.productDetailsTransformer(
      kafkaMessage,
    );
    // updating product with cdc information
    if (productExistsInDestination) {
      return updateProductHandler(productData, productExistsInDestination);
    }

    return this.createProduct(productData);
  }

  public async handleProductCDCDelete(
    kafkaMessage: productDto,
  ): Promise<object> {
    const productExistsInDestination: string = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    if (productExistsInDestination) {
      const productDelete = await deleteProductHandler(
        productExistsInDestination,
      );
      const productIdDelete = await deleteProductId(kafkaMessage.TBItem_ID);
      return { productDelete, productIdDelete };
    }
    return;
  }

  private async createProduct(
    productData: productTransformed,
  ): Promise<object> {
    // creating new product and assigning it media
    const product: productCreate = await createProductHandler(productData);
    const productIdMapping = await insertProductId(productData.id, product);
    if (product.productCreate) {
      await this.productMediaClass.productMediaAssign(
        mediaMock,
        product.productCreate.product.id,
      );
    }
    return { product, productIdMapping };
  }
}
