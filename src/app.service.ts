import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  createProductHandler,
  updateProductMetadataHandler,
} from './graphql/handlers/product';
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
import { BATCH_SIZE } from 'common.env';

@Injectable()
export class AppService {
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
  handleProductCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.productService.handleProductCDCDelete(
            kafkaMessage.before.TBItem_ID,
          )
        : this.productService.handleProductCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('product deleted');
    }
  }

  handleMasterCategoryCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.categoryService.handleMasterCategoryCDCDelete(
            kafkaMessage.before,
          )
        : this.categoryService.handleMasterCategoryCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('category deleted');
    }
  }

  handleSubCategoryCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.categoryService.handleSubCategoryCDCDelete(kafkaMessage.before)
        : this.categoryService.handleSubCategoryCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('category deleted');
    }
  }

  handleCustomerCDC(kafkaMessage) {
    try {
      return this.retailerService.retailerCreate(kafkaMessage);
    } catch (error) {
      Logger.log('customer deleted');
    }
  }

  public addProductCatalog(kafkaMessage) {
    return createProductHandler(kafkaMessage);
  }

  handleShopCDC(kafkaMessage) {
    try {
      return kafkaMessage.op == 'd'
        ? this.shopService.handleShopCDCDelete(kafkaMessage.before)
        : this.shopService.handleShopCDC(kafkaMessage.after);
    } catch (error) {
      Logger.log('shop deleted');
    }
  }

  handleSelectColorCDC(kafkaMessage) {
    try {
      return kafkaMessage.op !== 'd'
        ? this.productVariantService.handleSelectColorCDC(kafkaMessage.after)
        : '';
    } catch (error) {
      Logger.log('variant deleted');
    }
  }

  // big data import methods dividing data in batches and running them in pools
  async productBulkCreate(bulkArray) {
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
      const { results } = await PromisePool.withConcurrency(100)
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
}
