import { Injectable } from '@nestjs/common';
import {
  addProductToShopHandler,
  createBulkProductsHandler,
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
import {
  productDatabaseViewInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
import {
  getNonExistentProducts,
  getSourceProductIds,
  idBase64Decode,
  validateCreatedProducts,
} from './Product.utils';
import { ApplicationLogger } from 'src/logger/Logger.service';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';
import {
  addBulkProductMapping,
  addProductMapping,
  getProductMapping,
  getProductMappingBulk,
  removeProductMapping,
} from 'src/mapping/methods/product';
import { autoSyncWebhookHandler } from 'src/external/endpoints/autoSync';
import { SHOES_GROUP_NAME } from 'common.env';
import { BundleImportType, ProductOperationEnum } from 'src/api/import.dtos';
import { updateProductTimestamp } from 'src/database/postgres/handlers/product';
import { ProductValidationService } from './Product.validate.service';
import { BulkProductResults, BulkProductFail } from './Product.types';

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
    private readonly productValidationService: ProductValidationService,
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
    importType: BundleImportType,
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
        if (productData.type) {
          /**
           * Performs product creation since the product doesn't exist in the destination system.
           */
          await this.productCreate(productData, importType);
        }
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
      await this.productCreate(productData, importType);
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
  private async productCreate(
    productData: productTransformed,
    bundleImportType = BundleImportType.DATABASE,
  ) {
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
          this.productVariantsCreate(productData, productId, bundleImportType),
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
    const decodedProductId = idBase64Decode(productId);
    const validateProduct =
      await this.productValidationService.validateCreatedProduct(productId);
    if (validateProduct) {
      return await Promise.all([
        updateProductTimestamp(
          decodedProductId,
          productData.createdAt,
          productData.updatedAt,
        ),
        this.productListingUpdate(productId, productData),
        this.productVariantService.productVariantsUpdate(
          productId,
          productData,
        ),
        updateProductHandler(productData, productId),
      ]);
    } else {
      this.logger.log('Created Product validation failed', productId);
      return await this.productDelete(productId);
    }
  }

  public async productDelete(destinationId: string) {
    this.logger.log('Deleting product', destinationId);
    if (destinationId) {
      const productDelete = await deleteProductHandler(destinationId);
      const productIdDelete = await removeProductMapping(destinationId);

      this.logger.log('product deleted', destinationId);
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
    bundleImportType = BundleImportType.DATABASE,
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
        this.productVariantMediaCreate(productId, productVariantData);
      } else {
        await this.productVariantService.productVariantAssign(
          productVariantData,
          productId,
          productData,
          productData.shopId,
          bundleImportType,
        );
        this.productVariantMediaCreate(productId, productVariantData);
      }
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
    productVariantData: productVariantInterface,
  ) {
    await this.productMediaClass.productVariantMediaAssign(
      productId,
      productVariantData,
    );
  }

  /**
   * Stores listing of product based on its activation and type
   * --
   * product is marked as active if it is active in source as well as it is marked as wholesale type
   */
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

  public async productListingDeActivate(productId: string) {
    this.logger.log(`removing listing`, productId);
    return await removeChannelListingHandler(productId);
  }

  public async bulkProductCreate(sourceProducts: productDto[]) {
    const bulkProductsTransformed =
      await this.transformerClass.productBulkDetailsTransformer(sourceProducts);
    const sourceProductIds = getSourceProductIds(bulkProductsTransformed);
    const getBulkProductMapping = await getProductMappingBulk(sourceProductIds);
    const nonExistentProducts = getNonExistentProducts(
      bulkProductsTransformed,
      getBulkProductMapping,
    );
    await createBulkProductsHandler(nonExistentProducts);
  }

  public async saveBulkProductMapping(
    productsResults: Array<BulkProductResults | BulkProductFail>,
    shopId: string,
  ) {
    const validateNewProducts = validateCreatedProducts(productsResults);
    return await addBulkProductMapping(validateNewProducts, shopId);
  }

  /**
   * Saves the media information for the bulk product results.
   * @param {BulkProductResults[]} productsResults - An array of BulkProductResults containing the products for which media needs to be saved.
   * @param {Map<string, productTransformed>} transformedProducts - A Map containing transformed products with their IDs as keys and media information as values.
   * @returns {Promise<void>} A promise that resolves when all the media information is saved for the products.
   */
  public async saveBulkProductMedia(
    productsResults: BulkProductResults[],
    transformedProducts: Map<string, productTransformed>,
  ): Promise<void> {
    try {
      const mediaSavingPromises = productsResults.map(async (product) => {
        const sourceId = product.product.id;
        const media = transformedProducts.get(sourceId)?.media;
        if (media) {
          await this.productMediaCreate(product.product.id, media);
        } else {
          this.logger.warn(
            `Media information not found for product ID: ${sourceId}`,
          );
        }
      });

      await Promise.all(mediaSavingPromises);

      this.logger.verbose(
        `Media information saved for ${mediaSavingPromises.length} products.`,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred while saving product media information: ${error.message}`,
        error,
      );
      throw new Error('Failed to save product media information.');
    }
  }

  /**
   * Saves the variant media information for the bulk product results.
   * @param {BulkProductResults[]} productsResults - An array of BulkProductResults containing the products for which variant media needs to be saved.
   * @returns {Promise<void>} A promise that resolves when all the variant media information is saved for the products.
   */
  public async saveBulkProductVariantMedia(
    productsResults: BulkProductResults[],
  ): Promise<void> {
    try {
      const variantMediaSavingPromises = productsResults.map(
        async (product) => {
          const databaseVariantsData = (await getProductDetailsFromDb(
            product.product.externalReference,
          )) as productDatabaseViewInterface;
          const transformDatabaseData =
            await this.transformerClass.productViewTransformer(
              databaseVariantsData,
            );
          return this.productMediaClass.createProductVariantMediaV2(
            product,
            product.product.id,
            transformDatabaseData,
          );
        },
      );

      // Wait for all variant media saving promises to resolve
      await Promise.all(variantMediaSavingPromises);

      this.logger.verbose(
        `Variant media information saved for ${variantMediaSavingPromises.length} products.`,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred while saving product variant media information: ${error.message}`,
        error,
      );
      throw new Error('Failed to save product variant media information.');
    }
  }
}
