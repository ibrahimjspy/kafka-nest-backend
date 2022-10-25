import { Injectable } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  fetchProductSlugById,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import { mediaMockSmall } from 'src/mock/product/media';
import {
  fetchProductId,
  fetchProductSerialIdBySlug,
  insertProductId,
} from 'src/postgres/handlers/product';
import {
  productCDC,
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

  public async handleProductCDC(kafkaMessage: productCDC): Promise<object> {
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

  private async createProduct(
    productData: productTransformed,
  ): Promise<object> {
    // creating new product and assigning it media
    const product: productCreate = await createProductHandler(productData);
    const productIdMapping = await insertProductId(productData.id, product);

    // product created successfully
    if (product.productCreate) {
      const productSerialId = await this.getProductSerialId(
        product.productCreate.product.id,
      );
      // product serial id fetched successfully
      if (productSerialId) {
        await this.productMediaClass.productMediaAssign(
          mediaMockSmall,
          productSerialId,
        );
      }
    }

    return { product, productIdMapping };
  }

  public async getProductSerialId(uuid: string) {
    // fetches serialId against uuid <productId>
    const productSlug = await fetchProductSlugById(uuid);
    const productSerialId = await fetchProductSerialIdBySlug(productSlug); // postgres call
    return productSerialId;
  }
}
