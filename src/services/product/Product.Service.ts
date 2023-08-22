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
  getTransformedProductsMapping,
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
import { SHOES_GROUP_NAME } from 'common.env';
import { BundleImportType, ProductOperationEnum } from 'src/api/import.dtos';
import { updateProductTimestamp } from 'src/database/postgres/handlers/product';
import { ProductValidationService } from './Product.validate.service';
import { BulkProductResults, BulkProductFail } from './Product.types';
import { ConstantsService } from 'src/app.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductProductChannelListing } from 'src/database/postgres/tables/ProductListing';
import { Repository } from 'typeorm';
import { ProductProduct } from 'src/database/postgres/tables/Product';
import { ProductVariantDecoratorProductMapping } from 'src/database/postgres/tables/ShopProducts';

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
    private readonly constantsService: ConstantsService,
    @InjectRepository(ProductProductChannelListing)
    private productChannelListingRepository: Repository<ProductProductChannelListing>,
    @InjectRepository(ProductProduct)
    private productRepository: Repository<ProductProduct>,
    @InjectRepository(ProductVariantDecoratorProductMapping)
    private shopProductVariantRepository: Repository<ProductVariantDecoratorProductMapping>,
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
      const attributes = await this.constantsService.fetchAttributes();

      // Creating a new product and assigning it media
      const productId = await createProductHandler(productData, attributes);

      if (productId) {
        // Inserts product id into elastic search mapping
        addProductMapping(productData.id, productId, productData.shopId);

        // Creates product variants and their media
        await Promise.all([
          this.productMediaCreate(productId, productData.media),
          this.productVariantsCreate(productData, productId, bundleImportType),
        ]);
        addProductToShopHandler(productId, productData);
        storeProductStatusHandler(productId);
        this.updateProductTimestamps(idBase64Decode(productId), productData),
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
      const attributes = await this.constantsService.fetchAttributes();
      return await Promise.all([
        this.updateProductTimestamps(decodedProductId, productData),
        this.productListingUpdate(productId, productData),
        this.productVariantService.productVariantsUpdate(
          productId,
          productData,
        ),
        updateProductHandler(productData, productId, attributes),
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
    const createdProducts = await createBulkProductsHandler(
      nonExistentProducts,
      await this.constantsService.fetchAttributes(),
    );
    const sourceProductMapping = getTransformedProductsMapping(
      bulkProductsTransformed,
    );
    await this.saveBulkProductMapping(
      createdProducts,
      bulkProductsTransformed[0].shopId,
    );
    await Promise.all([
      this.saveBulkProductMedia(createdProducts, sourceProductMapping),
      this.saveBulkProductsBundles(
        createdProducts,
        bulkProductsTransformed[0].shopId,
      ),
      this.bulkProductsDefaultVariantAssign(createdProducts),
      this.bulkProductsTimestampsUpdate(createdProducts, sourceProductMapping),
      this.addBulkProductsToShop(createdProducts, sourceProductMapping),
    ]);
    this.saveBulkProductVariantMedia(createdProducts);

    this.logger.log('created bulk products', createdProducts.length);
    return createdProducts;
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
        const sourceId = product.product.externalReference;
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

  /**
   * Saves the bundle information for the bulk product results.
   * --
   * Note: This implementation does not cover shoe products.
   *
   * @param {BulkProductResults[]} productsResults - An array of BulkProductResults containing the products for which bundles need to be saved.
   * @param {string} shopId - The ID of the shop.
   * @returns {Promise<void>} A promise that resolves when all the bundle information is saved for the products.
   */
  public async saveBulkProductsBundles(
    productsResults: BulkProductResults[],
    shopId: string,
  ): Promise<void> {
    try {
      const bundlePromises: Promise<void[]>[] = [];

      for (const product of productsResults) {
        const databaseVariantsData = (await getProductDetailsFromDb(
          product.product.externalReference,
        )) as productDatabaseViewInterface;
        const variantIds = product.product.variants.map(
          (variant) => variant.id,
        );
        const transformDatabaseData =
          await this.transformerClass.productViewTransformer(
            databaseVariantsData,
          );

        const bundlePromise = this.productVariantService.createBundles({
          variantIds,
          bundle: databaseVariantsData.pack_name.split('-'),
          shopId,
          productId: product.product.id,
          productPrice: Number(transformDatabaseData.price.salePrice),
          isOpenBundle: false,
          importType: BundleImportType.DATABASE,
        });

        bundlePromises.push(bundlePromise);
      }

      // Wait for all bundle saving promises to resolve
      await Promise.all(bundlePromises);

      this.logger.verbose(
        `Bulk bundles saved for ${productsResults.length} products.`,
      );
    } catch (error) {
      this.logger.error(
        `An error occurred while saving product bundle information: ${error.message}`,
        error,
      );
      throw new Error('Failed to save product bundle information.');
    }
  }

  /**
   * Updates product timestamps usting source timestamps
   * @param {BulkProductResults[]} productId - An array of BulkProductResults containing the products for which bundles need to be saved.
   * @param {string} productData - The ID of the shop.
   * @returns {Promise<void>} A promise that resolves when all the bundle information is saved for the products.
   */
  public async updateProductTimestamps(
    productId: string,
    productData: productTransformed,
  ) {
    try {
      updateProductTimestamp(
        productId,
        productData.createdAt,
        productData.updatedAt,
      );
      const productChannelListing =
        await this.productChannelListingRepository.findOne({
          where: { product_id: Number(productId) },
        });

      const updatedListing: ProductProductChannelListing = {
        ...productChannelListing,
        available_for_purchase_at: new Date(productData.createdAt),
      };
      await this.productChannelListingRepository.save(updatedListing);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async bulkProductsDefaultVariantAssign(
    productsResults: BulkProductResults[],
  ) {
    try {
      this.logger.log('assigning default variants to product');
      const defaultVariantUpdatePromises = [];
      for (const product of productsResults) {
        const defaultVariantId = product.product.variants[0]?.id || null;
        if (!defaultVariantId) return;
        const decodedDefaultVariantId = idBase64Decode(defaultVariantId);
        const decodedProductId = idBase64Decode(product.product.id);
        const defaultVariantPromise = this.productRepository.update(
          { id: Number(decodedProductId) },
          { default_variant_id: Number(decodedDefaultVariantId) },
        );
        defaultVariantUpdatePromises.push(defaultVariantPromise);
      }
      await Promise.all(defaultVariantUpdatePromises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async bulkProductsTimestampsUpdate(
    productsResults: BulkProductResults[],
    transformedProducts: Map<string, productTransformed>,
  ) {
    try {
      this.logger.log('saving product timestamps from source');

      const timeStampPromises = [];
      for (const product of productsResults) {
        const defaultVariantId = product.product.variants[0]?.id || null;
        if (!defaultVariantId) return;
        const timestampPromise = this.updateProductTimestamps(
          idBase64Decode(product.product.id),
          transformedProducts.get(product.product.externalReference),
        );
        timeStampPromises.push(timestampPromise);
      }
      await Promise.all(timeStampPromises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  public async addBulkProductsToShop(
    productsResults: BulkProductResults[],
    transformedProducts: Map<string, productTransformed>,
  ) {
    try {
      const shopProductMappings = [];
      this.logger.log('saving product timestamps from source');

      for (const product of productsResults) {
        const sourceProduct = transformedProducts.get(
          product.product.externalReference,
        );
        const shopId = sourceProduct.shopId;
        const isOpenPack = sourceProduct.openPack;
        const shopProductMapping: ProductVariantDecoratorProductMapping = {
          product_id: product.product.id,
          shop_id: Number(shopId),
          is_open_bundle: isOpenPack,
          channel_slug: 'default-channel',
          id: null,
        };
        shopProductMappings.push(shopProductMapping);
      }
      await this.shopProductVariantRepository.save(shopProductMappings);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
