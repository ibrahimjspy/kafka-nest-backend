import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductProduct } from 'src/database/postgres/tables/Product';
import { ProductProductChannelListing } from 'src/database/postgres/tables/ProductListing';
import { ProductProductVariantChannelListing } from 'src/database/postgres/tables/ProductVariantListing';
import { ProductProductVariant } from 'src/database/postgres/tables/ProductVariants';
import { getAllShopsMapping } from 'src/mapping/methods/shop';
import { productDto } from 'src/transformer/types/product';
import { Repository } from 'typeorm';
import { ShopMappingType } from './Sync.service.types';
import { fetchBulkProductsData } from 'src/database/mssql/bulk-import/methods';
import {
  BundleImportType,
  ProductOperationEnum,
  createProductsSyncDto,
  cursorDto,
} from 'src/api/import.dtos';
import PromisePool from '@supercharge/promise-pool';
import { chunkArray } from '../Product.utils';
import { ProductService } from '../Product.Service';

@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  constructor(
    @InjectRepository(ProductProduct)
    private productRepository: Repository<ProductProduct>,
    @InjectRepository(ProductProductChannelListing)
    private productChannelListingRepository: Repository<ProductProductChannelListing>,
    @InjectRepository(ProductProductVariantChannelListing)
    private productVariantChannelListingRepository: Repository<ProductProductVariantChannelListing>,
    @InjectRepository(ProductProductVariant)
    private productVariantRepository: Repository<ProductProductVariant>,
    private productService: ProductService,
  ) {}
  /**
   * Synchronize product listings for all vendors.
   */
  public async productsListingSync(cursor: cursorDto): Promise<void> {
    const importedVendors = (await getAllShopsMapping()) as ShopMappingType[];
    const filterVendors = importedVendors.slice(
      cursor.startCurser,
      cursor.endCurser,
    );
    const SYNC_BATCH_SIZE = 5;
    await PromisePool.withConcurrency(SYNC_BATCH_SIZE)
      .for(filterVendors)
      .onTaskStarted((product, pool) => {
        this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        this.logger.log(`Active tasks: ${pool.activeTasksCount()}`);
        this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
        this.logger.log(`Finished tasks: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (vendor) => {
        this.logger.log('Syncing vendor listing', vendor.shr_shop_name?.raw);
        const sourceProductsPromise = this.getSourceVendorProducts(
          vendor.os_vendor_id.raw,
        );
        const destinationProductsPromise = this.getDestinationVendorProduct(
          vendor.shr_shop_id.raw,
        );

        const [sourceProducts, destinationProducts] = await Promise.all([
          sourceProductsPromise,
          destinationProductsPromise,
        ]);

        return this.syncVendorProductsListing(
          sourceProducts,
          destinationProducts,
        );
      });

    this.logger.verbose('Vendor product listing sync completed successfully');
  }
  /**
   * Synchronize product variant pricing for all vendors.
   */
  public async productVariantPricingSync(cursor: cursorDto): Promise<void> {
    const importedVendors = (await getAllShopsMapping()) as ShopMappingType[];
    const filterVendors = importedVendors.slice(
      cursor.startCurser,
      cursor.endCurser,
    );
    const SYNC_BATCH_SIZE = 3;

    await PromisePool.withConcurrency(SYNC_BATCH_SIZE)
      .for(filterVendors)
      .onTaskStarted((vendor, pool) => {
        this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        this.logger.log(`Active tasks: ${pool.activeTasksCount()}`);
        this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
        this.logger.log(`Finished tasks: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (vendor) => {
        this.logger.log('Syncing vendor listing', vendor.shr_shop_name?.raw);

        const sourceProductsPromise = this.getSourceVendorProducts(
          vendor.os_vendor_id.raw,
        );
        const destinationProductsPromise = this.getDestinationVendorProduct(
          vendor.shr_shop_id.raw,
        );

        const [sourceProducts, destinationProducts] = await Promise.all([
          sourceProductsPromise,
          destinationProductsPromise,
        ]);

        return this.syncVendorPricing(sourceProducts, destinationProducts);
      });

    this.logger.verbose('Vendor product pricing sync completed successfully');
  }

  /**
   * Synchronize newly created vendor products with destination vendor products for a specific range of vendors.
   *
   * @param cursor - Object containing cursor details for filtering vendors.
   */
  public async createdProductSync(
    cursor: createProductsSyncDto,
  ): Promise<void> {
    const importedVendors = (await getAllShopsMapping()) as ShopMappingType[];
    const filterVendors = importedVendors.slice(
      cursor.startCurser,
      cursor.endCurser,
    );
    const SYNC_BATCH_SIZE = 1;

    await PromisePool.withConcurrency(SYNC_BATCH_SIZE)
      .for(filterVendors)
      .onTaskStarted((vendor, pool) => {
        this.logger.log(`Finished vendors: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (vendor) => {
        this.logger.log('Syncing vendor listing', vendor.shr_shop_name?.raw);

        const sourceProductsPromise = this.getSourceVendorProducts(
          vendor.os_vendor_id.raw,
          true,
        );
        const destinationProductsPromise = this.getDestinationVendorProduct(
          vendor.shr_shop_id.raw,
        );

        const [sourceProducts, destinationProducts] = await Promise.all([
          sourceProductsPromise,
          destinationProductsPromise,
        ]);

        return this.syncVendorCreatedProducts(
          sourceProducts,
          destinationProducts,
          cursor.count || sourceProducts.size,
        );
      });

    this.logger.verbose('Vendor created products sync completed successfully');
  }

  /**
   * Synchronize product listings for all vendors.
   */
  public async productTimestampsSync(cursor: cursorDto): Promise<void> {
    const importedVendors = (await getAllShopsMapping()) as ShopMappingType[];
    const filterVendors = importedVendors.slice(
      cursor.startCurser,
      cursor.endCurser,
    );
    const SYNC_BATCH_SIZE = 5;
    await PromisePool.withConcurrency(SYNC_BATCH_SIZE)
      .for(filterVendors)
      .onTaskStarted((product, pool) => {
        this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        this.logger.log(`Active tasks: ${pool.activeTasksCount()}`);
        this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
        this.logger.log(`Finished tasks: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (vendor) => {
        this.logger.log('Syncing vendor listing', vendor.shr_shop_name?.raw);
        const sourceProductsPromise = this.getSourceVendorProducts(
          vendor.os_vendor_id.raw,
        );
        const destinationProductsPromise = this.getDestinationVendorProduct(
          vendor.shr_shop_id.raw,
        );

        const [sourceProducts, destinationProducts] = await Promise.all([
          sourceProductsPromise,
          destinationProductsPromise,
        ]);

        return this.syncVendorTimestamps(sourceProducts, destinationProducts);
      });

    this.logger.verbose('Vendor product listing sync completed successfully');
  }

  public async createdProductSyncV2(
    cursor: createProductsSyncDto,
  ): Promise<void> {
    const importedVendors = (await getAllShopsMapping()) as ShopMappingType[];
    const filterVendors = importedVendors.slice(
      cursor.startCurser,
      cursor.endCurser,
    );
    const SYNC_BATCH_SIZE = 1;

    await PromisePool.withConcurrency(SYNC_BATCH_SIZE)
      .for(filterVendors)
      .onTaskStarted((vendor, pool) => {
        this.logger.log(`Finished vendors: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (vendor) => {
        this.logger.log('Syncing vendor listing', vendor.shr_shop_name?.raw);

        const sourceProductsPromise = this.getSourceVendorProducts(
          vendor.os_vendor_id.raw,
          true,
        );
        const destinationProductsPromise = this.getDestinationVendorProduct(
          vendor.shr_shop_id.raw,
        );

        const [sourceProducts, destinationProducts] = await Promise.all([
          sourceProductsPromise,
          destinationProductsPromise,
        ]);

        return this.syncVendorCreatedProductsV2(
          sourceProducts,
          destinationProducts,
          cursor.count || sourceProducts.size,
        );
      });

    this.logger.verbose('Vendor created products sync completed successfully');
  }

  /**
   * Fetch source vendor products by shop ID.
   * @param shopId Shop ID of the vendor.
   * @param filter whether you want to filter inactive products
   * @returns A mapping of product IDs to source products.
   */
  private async getSourceVendorProducts(shopId: string, filter = false) {
    this.logger.log('fetching source vendor products', shopId);
    const productMappings: Map<number, productDto> = new Map();
    const sourceProducts = (await fetchBulkProductsData(
      shopId,
      filter,
    )) as productDto[];
    this.logger.log('fetched source vendor products', sourceProducts.length);
    sourceProducts.map((product) => {
      productMappings.set(Number(product.TBItem_ID), product);
    });
    return productMappings;
  }
  /**
   * Fetch destination vendor products by shop ID.
   * @param shopId Shop ID of the vendor.
   * @returns An array of destination products.
   */

  public async getDestinationVendorProduct(shopId: string) {
    this.logger.log('fetching destination vendor products', shopId);

    const metadataKey = 'vendorId';

    const destinationVendorProducts = await this.productRepository
      .createQueryBuilder('product')
      .where(`product.metadata ->> :metadataKey = :metadataValue`, {
        metadataKey,
        metadataValue: shopId,
      })
      .getMany();
    this.logger.log(
      'fetched destination vendor products',
      destinationVendorProducts.length,
    );

    return destinationVendorProducts;
  }
  /**
   * Synchronize product listings for a vendor.
   * @param sourceProductsMapping Mapping of source products.
   * @param destinationVendorProducts Array of destination products.
   */
  private async syncVendorProductsListing(
    sourceProductsMapping: Map<number, productDto>,
    destinationVendorProducts: ProductProduct[],
  ): Promise<void> {
    const promises = destinationVendorProducts.map(async (product) => {
      if (!product.external_reference) {
        this.logger.log(
          'Did not find external reference for product',
          product.id,
        );
        return;
      }
      this.logger.log(
        `Syncing destination product ${product.id} with source ${product.external_reference}`,
      );
      const sourceData = sourceProductsMapping.get(
        Number(product.external_reference),
      );
      if (!sourceData) {
        this.logger.warn(
          'Did not find source product data for product',
          product.id,
        );
        return;
      }
      const isActiveProduct = this.isActiveProduct(sourceData);

      if (!isActiveProduct) {
        this.logger.log('Inactivating product', product.id);

        const productListingPromise =
          this.productChannelListingRepository.findOne({
            where: {
              product_id: product.id,
            },
          });

        const productListing = await productListingPromise;

        if (productListing) {
          const updatedListing = { ...productListing };
          updatedListing.is_published = false;
          updatedListing.visible_in_listings = false;
          await this.productChannelListingRepository.save(updatedListing);
        }
      }
      this.logger.log('product listing is valid', product.id);
    });

    await Promise.allSettled(promises);
  }
  /**
   * Check if a product is active.
   * @param productData Source product data.
   * @returns `true` if the product is active, otherwise `false`.
   */
  private isActiveProduct(productData: productDto) {
    const valid = 'Y';
    if (
      productData.nActive == valid &&
      productData.nVendorActive == valid &&
      productData.nSoldOut !== valid
    ) {
      return true;
    }
    return false;
  }
  /**
   * Synchronize product variant pricing for a vendor.
   * @param sourceProductsMapping Mapping of source products.
   * @param destinationVendorProducts Array of destination products.
   */
  private async syncVendorPricing(
    sourceProductsMapping: Map<number, productDto>,
    destinationVendorProducts: ProductProduct[],
  ): Promise<void> {
    const promises = destinationVendorProducts.map(async (product) => {
      if (!product.external_reference) {
        this.logger.log(
          'Did not find external reference for product',
          product.id,
        );
        return;
      }
      this.logger.log(
        `Syncing destination product ${product.id} with source ${product.external_reference}`,
      );

      const sourceData = sourceProductsMapping.get(
        Number(product.external_reference),
      );

      if (!sourceData) {
        this.logger.warn(
          'Did not find source product data for product',
          product.id,
        );
        return;
      }
      const defaultVariantPricePromise = this.getDefaultVariantPrice(
        product.default_variant_id,
      );

      const [defaultVariantPrice] = await Promise.all([
        defaultVariantPricePromise,
      ]);

      if (!this.isVariantPriceValid(sourceData, defaultVariantPrice)) {
        this.logger.log('Syncing variant pricing', product.id);

        await this.updateVariantPricing(sourceData, product.id);
      }
      this.logger.log('product pricing is valid', product.id);
    });

    await Promise.allSettled(promises);
  }

  private async getDefaultVariantPrice(defaultVariantId: number) {
    const defaultVariantListing =
      await this.productVariantChannelListingRepository.findOne({
        where: {
          variant_id: defaultVariantId,
        },
      });
    return defaultVariantListing.price_amount;
  }
  /**
   * Get the source price of a product.
   * @param sourceProduct The source product data.
   * @returns The source price of the product.
   */
  private getSourcePrice(sourceProduct: productDto) {
    const { nSalePrice2, nPrice2, nOnSale } = sourceProduct;
    const productMinimumPrice = nOnSale == 'Y' ? nSalePrice2 : nPrice2;
    return Number(productMinimumPrice);
  }
  /**
   * Check if the variant price is valid.
   * @param sourceProduct The source product data.
   * @param defaultVariantPrice The default variant price.
   * @returns `true` if the variant price is valid, otherwise `false`.
   */
  public isVariantPriceValid(
    sourceProduct: productDto,
    defaultVariantPrice: number,
  ) {
    if (this.getSourcePrice(sourceProduct) == defaultVariantPrice) return true;
  }
  /**
   * Update the pricing of product variants.
   * @param sourceProduct The source product data.
   * @param destinationProductId The ID of the destination product.
   */
  private async updateVariantPricing(
    sourceProduct: productDto,
    destinationProductId: number,
  ): Promise<void> {
    this.logger.log('Updating variant pricing', destinationProductId);
    const sourcePrice = this.getSourcePrice(sourceProduct);
    const productVariants = await this.productVariantRepository.find({
      where: {
        product_id: destinationProductId,
      },
    });

    const promises = productVariants.map(async (productVariant) => {
      const variantListingPromise =
        this.productVariantChannelListingRepository.findOne({
          where: {
            variant_id: productVariant.id,
          },
        });

      const variantListing = await variantListingPromise;

      if (variantListing) {
        const updatedListing = { ...variantListing };
        updatedListing.price_amount = sourcePrice;
        await this.productVariantChannelListingRepository.save(updatedListing);
      }
    });

    await Promise.allSettled(promises);
  }

  /**
   * Synchronize newly created vendor products with destination vendor products.
   *
   * @param sourceProductsMapping - Mapping of source product IDs to product data.
   * @param destinationVendorProducts - List of existing destination vendor products.
   * @param count - Maximum number of products to sync.
   */
  private async syncVendorCreatedProducts(
    sourceProductsMapping: Map<number, productDto>,
    destinationVendorProducts: ProductProduct[],
    count: number,
  ): Promise<void> {
    const destinationExternalProducts = destinationVendorProducts.map(
      (product) => Number(product.external_reference),
    );

    const nonExistentProducts: productDto[] = Array.from(
      sourceProductsMapping.keys(),
    )
      .filter((sourceId) => !destinationExternalProducts.includes(sourceId))
      .map((sourceId) => sourceProductsMapping.get(sourceId));

    const PRODUCT_BATCH_SIZE = 2;
    const PRODUCT_BATCH_COUNT = 200;

    // Divide non-existent products into batches for bulk processing
    const productChunks = chunkArray(
      nonExistentProducts.slice(0, count),
      PRODUCT_BATCH_COUNT,
    ) as productDto[][];

    this.logger.log(
      'Creating bulk products which are non-existent',
      nonExistentProducts.slice(0, count).length,
    );

    await PromisePool.withConcurrency(PRODUCT_BATCH_SIZE)
      .for(productChunks)
      .onTaskStarted((vendor, pool) => {
        this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        this.logger.log(`Active tasks: ${pool.activeTasksCount()}`);
        this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
        this.logger.log(`Finished tasks: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (products: productDto[]) => {
        return await this.productService.bulkProductCreate(products);
      });
  }

  /**
   * Synchronize product listings for a vendor.
   * @param sourceProductsMapping Mapping of source products.
   * @param destinationVendorProducts Array of destination products.
   */
  private async syncVendorTimestamps(
    sourceProductsMapping: Map<number, productDto>,
    destinationVendorProducts: ProductProduct[],
  ): Promise<void> {
    const products = [];
    const promises = destinationVendorProducts.map(async (product) => {
      if (!product.external_reference) {
        this.logger.log(
          'Did not find external reference for product',
          product.id,
        );
        return;
      }
      this.logger.log(
        `Syncing destination product ${product.id} with source ${product.external_reference}`,
      );
      const sourceData = sourceProductsMapping.get(
        Number(product.external_reference),
      );
      if (!sourceData) {
        this.logger.warn(
          'Did not find source product data for product',
          product.id,
        );
        return;
      }
      const updatedProduct: ProductProduct = {
        ...product,
        created_at: new Date(sourceData.OriginDate),
        updated_at: new Date(sourceData.nModifyDate),
      };
      products.push(updatedProduct);
    });

    await Promise.allSettled(promises);
    await this.productRepository.save(products);
  }

  private async syncVendorCreatedProductsV2(
    sourceProductsMapping: Map<number, productDto>,
    destinationVendorProducts: ProductProduct[],
    count: number,
  ): Promise<void> {
    const destinationExternalProducts = destinationVendorProducts.map(
      (product) => Number(product.external_reference),
    );

    const nonExistentProducts: productDto[] = Array.from(
      sourceProductsMapping.keys(),
    )
      .filter((sourceId) => !destinationExternalProducts.includes(sourceId))
      .map((sourceId) => sourceProductsMapping.get(sourceId));

    const PRODUCT_BATCH_SIZE = 10;
    this.logger.log(
      'Creating bulk products which are non-existent',
      nonExistentProducts.slice(0, count).length,
    );

    await PromisePool.withConcurrency(PRODUCT_BATCH_SIZE)
      .for(nonExistentProducts)
      .onTaskStarted((vendor, pool) => {
        this.logger.log(`Progress: ${pool.processedPercentage()}%`);
        this.logger.log(`Active tasks: ${pool.activeTasksCount()}`);
        this.logger.log(`Finished tasks: ${pool.processedItems().length}`);
        this.logger.log(`Finished tasks: ${pool.processedCount()}`);
      })
      .handleError((error) => {
        this.logger.error(error, 'ProductBulkCreate');
      })
      .process(async (products: productDto) => {
        return await this.productService.handleProductCDC(
          products,
          ProductOperationEnum.CREATE,
          BundleImportType.DATABASE,
        );
      });
  }
}
