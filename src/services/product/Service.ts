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
import { deleteProductId } from 'src/postgres/handlers/product';
import {
  productDto,
  productCreate,
  productTransformed,
} from 'src/types/product';
import { getProductDetails } from 'src/utils/mssql/fetch';
import { TransformerService } from '../../transformer/Transformer.service';
import { ProductMediaService } from './media/Service';
import { ProductVariantService } from './variant/Service';
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
    private readonly productVariantService: ProductVariantService,
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

    // product created successfully
    if (product.productCreate) {
      const productId = product.productCreate.product.id;
      const productSerialId = await this.getProductSerialId(productId);
      // product serial id fetched successfully
      if (productSerialId) {
        await this.productMediaClass.productMediaAssign(
          mediaMockSmall,
          productSerialId,
        );
      }
      await this.createProductVariants(productData, productId);
    }

    return { product, productIdMapping };
  }

  private async createProductVariants(
    productData: productTransformed,
    productId: string,
  ) {
    // fetches product variant information
    const productVariantData = await getProductDetails(productData.id);

    // creating product variant against color and sizes , assigns product variant price
    return await this.productVariantService.productVariantAssign(
      productVariantData,
      productId,
    );
  }

  public async getProductSerialId(uuid: string) {
    // fetches serialId against uuid <productId>
    const productSlug = await fetchProductSlugById(uuid);
    const productSerialId = await fetchProductSerialIdBySlug(productSlug); // postgres call
    return productSerialId;
  }
}
