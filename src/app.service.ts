import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { updateProductMetadataHandler } from './graphql/handlers/product';
import { CategoryService } from './services/category/Category.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
import { PromisePool } from '@supercharge/promise-pool';
import { ShippingService } from './services/shop/shipping/Shipping.Service';
import { RetailerService } from './services/shop/retailer/Retailer.Service';
import { fetchStyleDetailsById } from './database/mssql/api_methods/getProductById';
import { prepareFailedResponse } from './app.utils';
import { getProductDetailsFromDb } from './database/mssql/product-view/getProductViewById';
import { productVariantInterface } from './database/mssql/types/product';
import { TransformerService } from './transformer/Transformer.service';
import { getAllMappings, getProductMapping } from './mapping/methods/product';
import { BATCH_SIZE, VARIANT_MEDIA_BATCH_SIZE } from 'common.env';
import { fetchBulkProductsData } from './database/mssql/bulk-import/methods';
import { productDto } from './transformer/types/product';
import {
  BulkProductImportDto,
  BundleImportType,
  ProductOperationEnum,
} from './api/import.dtos';
import { shopDto } from './transformer/types/shop';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
    private readonly productVariantService: ProductVariantService,
    private readonly shippingMethodService: ShippingService,
    private readonly retailerService: RetailerService,
    private readonly transformerService: TransformerService,
  ) {}

  // ChangeDataCapture methods
  async handleProductCDC(kafkaMessage) {
    try {
      const payload = kafkaMessage.payload as productDto;
      Logger.log('kafka tb style number event received', payload);
      const validateVendor = await this.shopService.validateSharoveVendor(
        payload.TBVendor_ID,
      );
      if (!validateVendor) return;
      const productPayload = kafkaMessage.payload as productDto;
      const sourceProductDetails = (await fetchStyleDetailsById(
        productPayload.TBItem_ID,
      )) as productDto;
      this.logger.log('Product validation passed, syncing product');
      return await this.productService.handleProductCDC(
        sourceProductDetails,
        ProductOperationEnum.SYNC,
        BundleImportType.DATABASE,
      );
    } catch (error) {
      Logger.log('product sync call failed', error);
    }
  }

  async handleShopCDC(kafkaMessage) {
    try {
      const payload = kafkaMessage.payload as shopDto;
      Logger.log('kafka tb vendor event received', payload);
      const validateVendor = await this.shopService.validateSharoveVendor(
        payload.TBVendor_ID,
      );
      if (!validateVendor) return;
      await this.shopService.handleShopCDC(payload);
    } catch (error) {
      Logger.log('shop sync call failed', error);
    }
  }
  /**
   * Handles the sync of products based on the provided bulk import input.
   * @param {Object} bulkImportInput - The input for the bulk import operation.
   * @param {string} bulkImportInput.vendorId - The ID of the vendor.
   * @param {number} bulkImportInput.startCurser - The starting cursor for selecting products from the vendor's data.
   * @param {number} bulkImportInput.endCurser - The ending cursor for selecting products from the vendor's data.
   * @returns {Promise<string>} A promise that resolves to a string indicating the number of products created.
   */
  async handleProductSyncCDC(bulkImportInput: BulkProductImportDto) {
    try {
      this.logger.log('Fetching bulk products data...');
      const vendorProducts = (await fetchBulkProductsData(
        bulkImportInput.vendorId,
      )) as productDto[];
      this.logger.log(
        'Bulk products data fetched successfully.',
        vendorProducts.length,
      );

      const { startCurser, endCurser, operation } = bulkImportInput;
      const productBatch = vendorProducts.slice(startCurser, endCurser);

      this.logger.log(`Creating ${productBatch.length} products...`);
      await this.productBulkCreate(
        productBatch,
        operation,
        bulkImportInput.importType,
      );
      this.logger.log(`${productBatch.length} products created.`);

      return `${productBatch.length} products created`;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Handles the sync of product colors based on the provided bulk import input.
   * @param {Object} bulkImportInput - The input for the bulk import operation.
   * @param {string} bulkImportInput.vendorId - The ID of the vendor.
   * @param {number} bulkImportInput.startCurser - The starting cursor for selecting products from the vendor's data.
   * @param {number} bulkImportInput.endCurser - The ending cursor for selecting products from the vendor's data.
   * @returns {Promise<string>} A promise that resolves to a string indicating the number of products created.
   */
  async handleProductColorsSyncCDC(bulkImportInput: BulkProductImportDto) {
    try {
      this.logger.log('Fetching bulk products data for color syncing ...');
      const vendorProducts = (await fetchBulkProductsData(
        bulkImportInput.vendorId,
      )) as productDto[];
      this.logger.log(
        'Bulk products data fetched successfully.',
        vendorProducts.length,
      );

      const { startCurser, endCurser } = bulkImportInput;
      const productBatch = vendorProducts.slice(startCurser, endCurser);

      this.logger.log(`Syncing ${productBatch.length} products...`);
      await this.syncProductColors(productBatch);
      this.logger.log(`${productBatch.length} products colors synced`);

      return `${productBatch.length} products colors synced`;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // big data import methods dividing data in batches and running them in pools
  async productBulkCreate(
    bulkArray,
    operation: ProductOperationEnum,
    importType = BundleImportType.DATABASE,
  ) {
    try {
      const { results } = await PromisePool.withConcurrency(BATCH_SIZE)
        .for(bulkArray)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
          Logger.log(`Active tasks: ${pool.activeTasksCount()}`);
          Logger.log(`Finished tasks: ${pool.processedItems().length}`);
          Logger.log(`Finished tasks: ${pool.processedCount()}`);
        })
        .handleError((error) => {
          Logger.error(error, 'ProductBulkCreate');
        })
        .process(async (data: any) => {
          const productCreate = await this.productService.handleProductCDC(
            data,
            operation,
            importType,
          );
          return productCreate;
        });
      Logger.verbose(`${bulkArray.length} products created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  async shopBulkCreate(bulkArray, batchSize = 5) {
    try {
      const { results } = await PromisePool.for(bulkArray)
        .withConcurrency(batchSize)
        .process(async (data: any) => {
          const shopCreate = await this.shopService.handleShopCDC(data);

          return shopCreate;
        });
      Logger.verbose(`${bulkArray.length} shops created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  async shippingMethodBulkCreate(bulkArray, batchSize = 5) {
    try {
      const { results } = await PromisePool.for(bulkArray)
        .withConcurrency(batchSize)
        .process(async (data: any) => {
          const shippingMethodCreate =
            await this.shippingMethodService.createShippingMethods(data);

          return shippingMethodCreate;
        });
      Logger.verbose(`${bulkArray.length} shippingMethods created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  // ChangeDataCapture methods
  async createProductById(sourceProductId) {
    try {
      const sourceStyleDetails: any = fetchStyleDetailsById(sourceProductId);
      const createProduct = await this.productService.handleProductCDC(
        sourceStyleDetails,
        ProductOperationEnum.CREATE,
        BundleImportType.DATABASE,
      );
      return createProduct;
    } catch (error) {
      Logger.log('product creation failed');
      prepareFailedResponse(
        'product creation failed',
        HttpStatus.BAD_REQUEST,
        error,
      );
    }
  }

  // big data import methods dividing data in batches and running them in pools
  async productVariantMediaImport(bulkArray) {
    try {
      const { results } = await PromisePool.withConcurrency(
        VARIANT_MEDIA_BATCH_SIZE,
      )
        .for(bulkArray)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          Logger.error(error, 'ProductVariantMediaCreate');
        })
        .process(async (data: any) => {
          const productExistsInDestination: any = await getProductMapping(
            data.TBItem_ID,
          );
          if (productExistsInDestination) {
            const productVariantData: productVariantInterface =
              await this.transformerService.productViewTransformer(
                await getProductDetailsFromDb(data.TBItem_ID),
              );
            return await this.productService.productVariantMediaCreate(
              productExistsInDestination,
              productVariantData,
            );
          }
        });
      Logger.verbose(`${bulkArray.length} products variant media created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  async saveOpenPack(curserPage) {
    try {
      const mappings = await getAllMappings(curserPage);
      return await PromisePool.withConcurrency(30)
        .for(mappings)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          Logger.error(error, 'Save open packs');
        })
        .process(async (data) => {
          const sourceData = await fetchStyleDetailsById(data.sourceId);
          if (!sourceData) return;
          const productData =
            await this.transformerService.productDetailsTransformer(sourceData);
          return await updateProductMetadataHandler(
            data.destinationId,
            productData,
          );
        });
    } catch (error) {
      Logger.log(error);
    }
  }

  async updateProducts(curserPage) {
    try {
      const mappings = await getAllMappings(curserPage);
      return await PromisePool.withConcurrency(BATCH_SIZE)
        .for(mappings)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          Logger.error(error, 'updating products');
        })
        .process(async (data) => {
          const sourceData = await fetchStyleDetailsById(data.sourceId);
          if (!sourceData) return;
          return await this.productService.handleProductCDC(
            sourceData,
            ProductOperationEnum.UPDATE,
            BundleImportType.DATABASE,
          );
        });
    } catch (error) {
      Logger.log(error);
    }
  }

  async syncProductColors(bulkArray) {
    try {
      const { results } = await PromisePool.withConcurrency(BATCH_SIZE)
        .for(bulkArray)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
          Logger.log(`Active tasks: ${pool.activeTasksCount()}`);
          Logger.log(`Finished tasks: ${pool.processedItems().length}`);
          Logger.log(`Finished tasks: ${pool.processedCount()}`);
        })
        .handleError((error) => {
          Logger.error(error, 'ProductVariantColorSync');
        })
        .process(async (data: productDto) => {
          const productCreate = await this.productVariantService.syncColors(
            data.TBItem_ID,
          );
          return productCreate;
        });
      Logger.verbose(`${bulkArray.length} products variants synced`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  async syncProductListings(curserPage) {
    try {
      const mappings = await getAllMappings(curserPage);
      const BATCH = 20;
      return await PromisePool.withConcurrency(BATCH)
        .for(mappings)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          Logger.error(error, 'updating products');
        })
        .process(async (data) => {
          const sourceData = await fetchStyleDetailsById(data.sourceId);
          if (!sourceData) return;
          const productData =
            await this.transformerService.productDetailsTransformer(sourceData);
          return await this.productService.productListingUpdate(
            data.destinationId,
            productData,
          );
        });
    } catch (error) {
      Logger.log(error);
    }
  }

  async syncProductVariantPricing(curserPage) {
    try {
      const mappings = await getAllMappings(curserPage);
      const BATCH = 20;
      return await PromisePool.withConcurrency(BATCH)
        .for(mappings)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          Logger.error(error, 'updating products');
        })
        .process(async (data) => {
          const sourceData = await fetchStyleDetailsById(data.sourceId);
          if (!sourceData) return;
          const productData =
            await this.transformerService.productDetailsTransformer(sourceData);
          return await this.productVariantService.productVariantsUpdate(
            data.destinationId,
            productData,
          );
        });
    } catch (error) {
      Logger.log(error);
    }
  }

  /**
   * Deactivates vendor products based on the provided bulk import input.
   * @param bulkImportInput The bulk import input containing vendor ID and cursor positions.
   */
  async deactivateVendor(bulkImportInput: BulkProductImportDto): Promise<void> {
    try {
      const BATCH = 20;
      this.logger.log('Fetching bulk products data for deactivating vendor...');

      // Fetch vendor products data
      const vendorProducts = (await fetchBulkProductsData(
        bulkImportInput.vendorId,
      )) as productDto[];
      this.logger.log(
        'Bulk products data fetched successfully.',
        vendorProducts.length,
      );

      const { startCurser, endCurser } = bulkImportInput;
      const productBatch = vendorProducts.slice(startCurser, endCurser);

      this.logger.log(`Syncing ${productBatch.length} products...`);

      await PromisePool.withConcurrency(BATCH)
        .for(productBatch)
        .onTaskStarted((product, pool) => {
          this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
          this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          this.logger.error(error, 'DeactivateProduct');
        })
        .process(async (data: productDto) => {
          // Check if product exists in destination
          const productExistsInDestination = await getProductMapping(
            data.TBItem_ID,
          );
          if (productExistsInDestination) {
            // Deactivate the product's listing
            await this.productService.productListingDeActivate(
              productExistsInDestination,
            );
          }
        });

      this.logger.log('Product channel listing deactivated');
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**
   * Deletes vendor products based on the provided bulk import input.
   * @param bulkImportInput The bulk import input containing vendor ID and cursor positions.
   */
  async deleteVendorProducts(
    bulkImportInput: BulkProductImportDto,
  ): Promise<void> {
    try {
      const BATCH = 20;
      this.logger.log(
        'Fetching bulk products data for deleting vendor products...',
      );

      // Fetch vendor products data
      const vendorProducts = (await fetchBulkProductsData(
        bulkImportInput.vendorId,
      )) as productDto[];
      this.logger.log(
        'Bulk products data fetched successfully.',
        vendorProducts.length,
      );

      const { startCurser, endCurser } = bulkImportInput;
      const productBatch = vendorProducts.slice(startCurser, endCurser);

      this.logger.log(`Deleting ${productBatch.length} products...`);

      await PromisePool.withConcurrency(BATCH)
        .for(productBatch)
        .onTaskStarted((product, pool) => {
          this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
          this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        })
        .handleError((error) => {
          this.logger.error(error, 'DeactivateProduct');
        })
        .process(async (data: productDto) => {
          // Check if product exists in destination
          const productExistsInDestination = await getProductMapping(
            data.TBItem_ID,
          );
          if (productExistsInDestination) {
            // Delete the product
            await this.productService.productDelete(productExistsInDestination);
          }
        });

      this.logger.log('Products against vendor deleted');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async syncVendorProducts({ vendorId }: { vendorId: string }) {
    try {
      this.logger.log(
        'Fetching bulk products data for vendor syncing ...',
        vendorId,
      );
      const vendorProducts = (await fetchBulkProductsData(
        vendorId,
      )) as productDto[];
      this.logger.log(
        'Bulk products data fetched successfully.',
        vendorProducts.length,
      );
      await this.productBulkCreate(vendorProducts, ProductOperationEnum.SYNC);
      this.logger.log('Product synced for vendors', vendorId);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async createCollection(subEventId: string) {
    try {
      this.logger.log('creating collection ...', subEventId);
      return await this.categoryService.collectionCreate(subEventId);
    } catch (error) {
      this.logger.log(error);
    }
  }
}
