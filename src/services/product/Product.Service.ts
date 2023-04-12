import { Injectable } from '@nestjs/common';
import {
  addProductToShopHandler,
  createProductHandler,
  deleteProductHandler,
  storeProductStatusHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import {
  mediaDto,
  productDto,
  productTransformed,
} from 'src/transformer/types/product';
import { TransformerService } from '../../transformer/Transformer.service';
import { ProductMediaService } from './media/Product.Media.Service';
import { ProductVariantService } from './variant/Product.Variant.Service';
import { productVariantInterface } from 'src/database/mssql/types/product';
import { idBase64Decode } from './Product.utils';
import { ApplicationLogger } from 'src/logger/Logger.service';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';
import {
  addProductMapping,
  getProductMapping,
  removeProductMapping,
} from 'src/mapping/methods/product';

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
    public logger: ApplicationLogger,
  ) {}

  public async handleProductCDC(kafkaMessage: productDto) {
    const productExistsInDestination: any = await getProductMapping(
      kafkaMessage.TBItem_ID,
    );
    const productData = await this.transformerClass.productDetailsTransformer(
      kafkaMessage,
    );
    if (productExistsInDestination) {
      return await this.productUpdate(productExistsInDestination, productData);
    }
    return await this.productCreate(productData);
  }

  public async handleProductCDCDelete(
    kafkaMessage: productDto,
  ): Promise<object> {
    const productExistsInDestination: string = await getProductMapping(
      kafkaMessage.TBItem_ID,
    );
    if (productExistsInDestination) {
      const productDelete = await deleteProductHandler(
        productExistsInDestination,
      );
      const productIdDelete = await removeProductMapping(
        productExistsInDestination,
      );
      return { productDelete, productIdDelete };
    }
    return;
  }

  private async productCreate(
    productData: productTransformed,
  ): Promise<object> {
    // creating new product and assigning it media
    const productId = await createProductHandler(productData);
    if (productId) {
      // inserts product id into id mapping table
      await addProductMapping(productData.id, productId, productData.shopId);
      // creates product variants and its media
      await Promise.all([
        await addProductToShopHandler(productId, productData.shopId),
        await this.productMediaCreate(productId, productData.media),
        this.productVariantsCreate(productData, productId),
      ]);
      await storeProductStatusHandler(productId);
      this.logger.verbose(`product flow completed against ${productId}`);
    }
    return {
      productId,
    };
  }

  public async productUpdate(
    productId: string,
    productData: productTransformed,
  ) {
    await this.productVariantService.productVariantsUpdate(
      productId,
      productData,
    );

    return await updateProductHandler(productData, productId);
  }

  public async productDelete(destinationId: string) {
    if (destinationId) {
      const productDelete = await deleteProductHandler(destinationId);
      const productIdDelete = await removeProductMapping(destinationId);
      return { productDelete, productIdDelete };
    }
  }

  public async productVariantsCreate(
    productData: productTransformed,
    productId: string,
  ) {
    // fetches product variant information
    const productVariantData: productVariantInterface =
      await this.transformerClass.productViewTransformer(
        await getProductDetailsFromDb(productData.id),
      );
    // creating product variant and its bundles against color and sizes , assigns product variant price
    if (productVariantData.productGroup == 'SHOES') {
      await this.productVariantService.shoeVariantsAssign(
        productVariantData,
        productId,
        productData.shopId,
      );
      return;
    }
    await this.productVariantService.productVariantAssign(
      productVariantData,
      productId,
      productData.shopId,
    );
    return;
  }

  public async productMediaCreate(productId: string, productMedia: mediaDto[]) {
    // fetches product serial id
    const productSerialId = idBase64Decode(productId);

    if (productSerialId) {
      // creates product media directly in database
      await this.productMediaClass.productMediaAssign(
        productMedia,
        productSerialId,
      );
    }
  }
  public async productVariantMediaCreate(
    productId: string,
    productVariantData,
  ) {
    await this.productMediaClass.productVariantMediaAssign(
      productId,
      productVariantData,
    );
  }
}
