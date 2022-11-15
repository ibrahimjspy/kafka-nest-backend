import { Injectable, Logger } from '@nestjs/common';
import { createProductHandler } from './graphql/handlers/product';
import { CategoryService } from './services/category/Category.Service';
import { ProductService } from './services/product/Product.Service';
import { ProductVariantService } from './services/product/variant/Product.Variant.Service';
import { ShopService } from './services/shop/Shop.Service';
import { PromisePool } from '@supercharge/promise-pool';
@Injectable()
export class AppService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
    private readonly productVariantService: ProductVariantService,
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
      const { results } = await PromisePool.withConcurrency(100)
        .for(bulkArray)
        .onTaskStarted((product, pool) => {
          Logger.log(`Progress: ${pool.processedPercentage()}%`);
          Logger.log(`Active tasks: ${pool.activeTasksCount()}`);
          Logger.log(`Finished tasks: ${pool.processedItems().length}`);
          Logger.log(`Finished tasks: ${pool.processedCount()}`);
        })
        .process(async (data: any) => {
          const create = await this.productService.handleProductCDC(data);
          return create;
        });
      Logger.verbose(`${bulkArray.length} products created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }

  async ShopBulkCreate(bulkArray, batchSize = 5) {
    try {
      const { results } = await PromisePool.for(bulkArray)
        .withConcurrency(batchSize)
        .process(async (data: any) => {
          const create = await this.shopService.handleShopCDC(data);

          return create;
        });
      Logger.verbose(`${bulkArray.length} shops created`);
      return results;
    } catch (error) {
      Logger.warn(error);
    }
  }
}
