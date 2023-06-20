import { Injectable } from '@nestjs/common';
import {
  addProductToShopHandler,
  createProductHandler,
  deleteProductHandler,
  productChannelListingHandler,
  removeChannelListingHandler,
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
import { autoSyncWebhookHandler } from 'src/external/endpoints/autoSync';
import { SHOES_GROUP_NAME } from 'common.env';
import { ProductOperationEnum } from 'src/api/import.dtos';

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

  /**
   * Handles the product change data capture (CDC) event based on the specified operation.
   * @param {productDto} kafkaMessage - The Kafka message containing the product data.
   * @param {ProductOperationEnum} operation - The operation to perform (SYNC, CREATE, UPDATE).
   * @returns {Promise<void>} A Promise that resolves once the operation is completed.
   */
  public async handleProductCDC(
    kafkaMessage: productDto,
    operation: ProductOperationEnum,
  ): Promise<void> {
    /**
     * Retrieves the product mapping from the destination system based on the Kafka message's TBItem_ID.
     * @type {any} The product mapping data.
     */
    const productExistsInDestination: any = await getProductMapping(
      kafkaMessage.TBItem_ID,
    );

    /**
     * Transforms the Kafka message into the desired product data format.
     * @type {Object} The transformed product data.
     */
    const productData = await this.transformerClass.productDetailsTransformer(
      kafkaMessage,
    );

    if (operation === ProductOperationEnum.SYNC) {
      if (!productExistsInDestination) {
        /**
         * Performs product creation since the product doesn't exist in the destination system.
         */
        await this.productCreate(productData);
      } else {
        /**
         * Performs product update since the product already exists in the destination system.
         */
        await this.productUpdate(productExistsInDestination, productData);
      }
    } else if (
      operation === ProductOperationEnum.CREATE &&
      !productExistsInDestination
    ) {
      /**
       * Performs product creation only if the product doesn't exist in the destination system.
       */
      await this.productCreate(productData);
    } else if (
      operation === ProductOperationEnum.UPDATE &&
      productExistsInDestination
    ) {
      /**
       * Performs product update only if the product exists in the destination system.
       */
      await this.productUpdate(productExistsInDestination, productData);
    }
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

  /**
   * Creates a new product, assigns media, creates variants, and updates the product status.
   * @param {productTransformed} productData - The transformed product data.
   * @returns {Promise<object>} An object containing the productId.
   */
  private async productCreate(productData: productTransformed) {
    try {
      if (!productData.listing) {
        this.logger.log('Product creation validation fail', productData.id);
        return;
      }
      // Creating a new product and assigning it media
      const productId = await createProductHandler(productData);

      if (productId) {
        // Inserts product id into elastic search mapping
        await addProductMapping(productData.id, productId, productData.shopId);

        // Creates product variants and their media
        await Promise.all([
          addProductToShopHandler(productId, productData),
          this.productMediaCreate(productId, productData.media),
          this.productVariantsCreate(productData, productId),
        ]);
        storeProductStatusHandler(productId);
        autoSyncWebhookHandler(productId);
        this.logger.verbose(
          `Product flow completed for productId: ${productId}`,
        );
      }

      return {
        productId,
      };
    } catch (error) {
      this.logger.error(
        `An error occurred while creating product: ${error.message}`,
        productData,
      );
      throw error;
    }
  }

  public async productUpdate(
    productId: string,
    productData: productTransformed,
  ) {
    return await Promise.all([
      this.productListingUpdate(productId, productData),
      this.productVariantService.productVariantsUpdate(productId, productData),
      updateProductHandler(productData, productId),
    ]);
  }

  public async productDelete(destinationId: string) {
    if (destinationId) {
      const productDelete = await deleteProductHandler(destinationId);
      const productIdDelete = await removeProductMapping(destinationId);
      return { productDelete, productIdDelete };
    }
  }

  /**
   * Creates product variants and assigns them to a product.
   * Fetches product variant information from the database.
   * If the product group is 'SHOES', assigns shoe variants.
   * Otherwise, assigns regular product variants.
   * @param productData - The transformed product data.
   * @param productId - The ID of the product to assign the variants.
   * @returns A promise that resolves when the variants have been assigned.
   */
  public async productVariantsCreate(
    productData: productTransformed,
    productId: string,
  ): Promise<void> {
    try {
      const productVariantData: productVariantInterface =
        await this.transformerClass.productViewTransformer(
          await getProductDetailsFromDb(productData.id),
        );

      if (productVariantData.productGroup === SHOES_GROUP_NAME) {
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
    } catch (error) {
      await this.productDelete(productId);
      throw error;
    }
  }

  /**
   * Creates product media for the specified product.
   * @param {string} productId - The ID of the product.
   * @param {mediaDto[]} productMedia - The media data to be assigned to the product.
   * @returns {Promise<void>} A promise that resolves when the product media is created.
   */
  public async productMediaCreate(
    productId: string,
    productMedia: mediaDto[],
  ): Promise<void> {
    // Fetch the product serial ID
    const productSerialId = idBase64Decode(productId);

    if (productSerialId) {
      // Create product media directly in the database
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

  public async productListingUpdate(
    productId: string,
    productData: productTransformed,
  ) {
    if (productData.listing) {
      return await productChannelListingHandler(productId);
    }
    this.logger.log(
      `removing listing due to product update in source ${productData.id}`,
      productId,
    );
    return await removeChannelListingHandler(productId);
  }
}
