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
import { cursorDto } from 'src/api/import.dtos';

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

    const syncPromises = filterVendors.map(async (vendor) => {
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

    await Promise.allSettled(syncPromises);
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
    const syncPromises = filterVendors.map(async (vendor) => {
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

    await Promise.allSettled(syncPromises);
    this.logger.verbose('Vendor product pricing sync completed successfully');
  }
  /**
   * Fetch source vendor products by shop ID.
   * @param shopId Shop ID of the vendor.
   * @returns A mapping of product IDs to source products.
   */
  public async getSourceVendorProducts(shopId: string) {
    this.logger.log('fetching source vendor products', shopId);
    const productMappings: Map<number, productDto> = new Map();
    const sourceProducts = (await fetchBulkProductsData(
      shopId,
      false,
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
  public async syncVendorProductsListing(
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
  public async isActiveProduct(productData: productDto) {
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
  public async syncVendorPricing(
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

        await this.updateVariantPricing(sourceData, defaultVariantPrice);
      }
      this.logger.log('product pricing is valid', product.id);
    });

    await Promise.allSettled(promises);
  }

  public async getDefaultVariantPrice(defaultVariantId: number) {
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
  public async isVariantPriceValid(
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
  public async updateVariantPricing(
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
}
