import { Injectable, Logger } from '@nestjs/common';
import {
  createProductHandler,
  deleteProductHandler,
  getProductDetailsHandler,
  updateProductHandler,
} from 'src/graphql/handlers/product';
import {
  deleteProductIdByDestinationId,
  fetchProductId,
  fetchProductSerialIdBySlug,
  insertProductId,
} from 'src/database/postgres/handlers/product';
import { deleteProductId } from 'src/database/postgres/handlers/product';
import {
  mediaDto,
  productDto,
  productTransformed,
} from 'src/transformer/types/product';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/fetch';
import { TransformerService } from '../../transformer/Transformer.service';
import { ProductMediaService } from './media/Product.Media.Service';
import { ProductVariantService } from './variant/Product.Variant.Service';
import { productVariantInterface } from 'src/database/mssql/types/product';

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

  public async handleProductCDC(kafkaMessage: productDto) {
    const productExistsInDestination: string = await fetchProductId(
      kafkaMessage.TBItem_ID,
    );
    const productData = await this.transformerClass.productDetailsTransformer(
      kafkaMessage,
    );
    if (productExistsInDestination) {
      // await this.productDelete(productExistsInDestination);
      return await this.productUpdate(productExistsInDestination, productData);
    }
    return await this.productCreate(productData);
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

  private async productCreate(
    productData: productTransformed,
  ): Promise<object> {
    // creating new product and assigning it media

    const productId = await createProductHandler(productData);
    if (productId) {
      // inserts product id into id mapping table
      await insertProductId(productData.id, productId);
      // creates product variants and its media
      await this.productMediaCreate(productId, productData.media);
      await this.productVariantsCreate(productData, productId);
      Logger.verbose(`product flow completed against ${productId}`);
    }
    return {
      productId,
    };
  }

  public async productUpdate(
    productId: string,
    productData: productTransformed,
  ) {
    await this.productMediaClass.productMediaUpdate(productId, productData);
    await this.productVariantService.productVariantsUpdate(
      productId,
      productData,
    );

    return await updateProductHandler(productData, productId);
  }

  public async productDelete(destinationId: string) {
    if (destinationId) {
      const productDelete = await deleteProductHandler(destinationId);
      const productIdDelete = await deleteProductIdByDestinationId(
        destinationId,
      );
      return { productDelete, productIdDelete };
    }
  }

  public async productVariantsCreate(
    productData: productTransformed,
    productId: string,
  ) {
    // fetches product variant information
    const productVariantData: productVariantInterface =
      await getProductDetailsFromDb(productData.id);
    // creating product variant and its bundles against color and sizes , assigns product variant price
    if (productVariantData.productGroup == 'SHOES') {
      return await this.productVariantService.shoeVariantsAssign(
        productVariantData,
        productId,
        productData.shopId,
      );
    }
    return await this.productVariantService.productVariantAssign(
      productVariantData,
      productId,
      productData.shopId,
    );
  }

  // source ID = 1234 =>  destination UUID = QXR0cmlidXRlOjE4 => serialId = 234
  public async getProductSerialId(uuid: string) {
    // fetches serialId against uuid <productId>
    const productSlug = await getProductDetailsHandler(uuid);
    const productSerialId = await fetchProductSerialIdBySlug(productSlug.slug); // postgres call
    return productSerialId;
  }

  public async productMediaCreate(productId: string, productMedia: mediaDto[]) {
    // fetches product serial id
    const productSerialId = await this.getProductSerialId(productId);

    if (productSerialId) {
      // creates product media directly in database
      await this.productMediaClass.productMediaAssign(
        productMedia,
        productSerialId,
      );
    }
  }
}
