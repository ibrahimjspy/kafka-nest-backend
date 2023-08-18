import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  createBulkVariantsHandler,
  productVariantBulkDeleteHandler,
  updateProductVariantAttributeResaleHandler,
  updateProductVariantPriceHandler,
} from 'src/graphql/handlers/productVariant';
import { TransformerService } from 'src/transformer/Transformer.service';
import {
  colorListInterface,
  productVariantInterface,
} from 'src/database/mssql/types/product';
import {
  priceInterface,
  productTransformed,
} from 'src/transformer/types/product';
import {
  deleteBundleHandler,
  getBundleIdsHandler,
  updateBundlePriceHandler,
} from 'src/graphql/handlers/bundle';
import {
  chunkArray,
  getBundlePrice,
  getShoeBundlesBySizes,
  getShoeSizes,
  getShoeVariantsMapping,
} from '../Product.utils';
import { ProductService } from '../Product.Service';
import { getProductDetailsHandler } from 'src/graphql/handlers/product';
import {
  addSkuToProductVariants,
  destinationVariantsByColor,
  validateProductColors,
  validateResalePrice,
} from './Product.Variant.utils';
import { createSkuHandler } from 'src/graphql/handlers/sku';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/getProductViewById';
import { bundlesCreateInterface } from './Product.Variant.types';
import { getProductMapping } from 'src/mapping/methods/product';
import { VariantsListInterface } from 'src/graphql/types/product';
import { BundleRepository } from 'src/database/repository/Bundle';
import { BundleImportType } from 'src/api/import.dtos';

/**
 *  Injectable class handling productVariant and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductVariantService {
  private readonly logger = new Logger(ProductVariantService.name);

  constructor(
    private readonly transformerClass: TransformerService,
    private readonly bundleRepository: BundleRepository,
    @Inject(forwardRef(() => ProductService))
    private readonly productClass: ProductService,
  ) {}

  public async productVariantsUpdate(
    productId,
    sourceProductData: productTransformed,
  ) {
    const productDetails = await getProductDetailsHandler(productId);

    if (productDetails.variants.length === 0) {
      return await this.productClass.productVariantsCreate(
        sourceProductData,
        productId,
      );
    }
    return await this.updatePrice(sourceProductData.price, productDetails);
  }

  /**
   * Assigns product variants to a given product ID.
   * Creates variants based on color and sizes, assigns prices and SKUs,
   * creates sales if the product is on sale, and creates bundles.
   * @param productVariantData - The product variant data.
   * @param productId - The ID of the product to assign the variants.
   * @param shopId - The ID of the shop associated with the product.
   * @returns A promise that resolves when the variants have been assigned.
   */
  public async productVariantAssign(
    productVariantData: productVariantInterface,
    productId: string,
    productData: productTransformed,
    shopId?: string,
    bundleImportType = BundleImportType.DATABASE,
  ): Promise<void> {
    const {
      sizes,
      price,
      color_list,
      pack_name,
      isPreOrder,
      product_id,
      sizeChartId,
    } = productVariantData;
    const productVariants = [];

    if (color_list) {
      for (const color of color_list) {
        const variants = await this.transformerClass.productVariantTransformer(
          color,
          sizes,
          isPreOrder,
          price,
        );
        productVariants.push(...variants);
      }

      const skuMap = await createSkuHandler(
        productVariants,
        product_id,
        sizeChartId,
      );
      addSkuToProductVariants(skuMap, productVariants);

      if (productVariants.length > 0) {
        // Logging the creation of product variants
        this.logger.verbose(
          `Creating ${productVariants.length} variants for product ${productId}`,
        );

        const variantIds = await createBulkVariantsHandler(
          productVariants,
          productId,
        );

        await this.createBundles({
          variantIds,
          bundle: pack_name.split('-'),
          shopId,
          productId,
          productPrice: Number(price.salePrice),
          isOpenBundle: productData.openPack,
          importType: bundleImportType,
        });

        // Logging the completion of variant assignment
        this.logger.verbose(
          `Variant assignment completed for product ${productId}`,
        );
      }
    }
  }

  /**
   * Creates bundles for the given variant IDs based on the bundle array.
   * @param variantIds - The array of variant IDs to be grouped into bundles.
   * @param bundle - The bundle array specifying the grouping of variants.
   * @param shopId - The ID of the shop associated with the bundles.
   * @param productId - The ID of the product associated with the bundles.
   * @returns A promise that resolves when all bundles have been created.
   */
  public async createBundles({
    variantIds,
    bundle,
    shopId,
    productId,
    productPrice,
    isOpenBundle,
  }: bundlesCreateInterface): Promise<void[]> {
    if (isOpenBundle) return;
    const bundleVariantIds = chunkArray(variantIds, bundle.length);
    const createBundlesPromises = bundleVariantIds.map(async (variants) => {
      const bundleQuantities = bundle.map((str) => Number(str));
      const bundlePrice = getBundlePrice(bundleQuantities, productPrice);
      return await this.bundleRepository.createBundles(
        variants,
        bundleQuantities,
        shopId,
        productId,
        bundlePrice,
        isOpenBundle,
      );
    });
    return Promise.all(createBundlesPromises);
  }

  private async updatePrice(price: priceInterface, destinationProductData) {
    if (
      parseFloat(price.purchasePrice as string) !==
      parseFloat(
        destinationProductData.variants[0].pricing?.price?.gross?.amount,
      )
    ) {
      this.logger.log('syncing cost price', destinationProductData);
      await Promise.all(
        destinationProductData.variants.map(async (variant) => {
          await updateProductVariantPriceHandler(
            variant.id,
            price.purchasePrice,
          );
          await updateProductVariantAttributeResaleHandler(
            variant.id,
            price.retailPrice,
          );
        }),
      );
      const bundleIds: any = await getBundleIdsHandler(
        destinationProductData.productId,
      );
      await updateBundlePriceHandler(bundleIds);
    } else {
      return this.syncResalePrice(price, destinationProductData);
    }
  }

  private async syncResalePrice(price: priceInterface, destinationProductData) {
    if (
      !validateResalePrice(
        price.retailPrice,
        destinationProductData.variants[0],
      )
    ) {
      this.logger.log('syncing resale price attribute', destinationProductData);
      await Promise.all(
        destinationProductData.variants.map(async (variant) => {
          await updateProductVariantAttributeResaleHandler(
            variant.id,
            price.retailPrice,
          );
        }),
      );
      return;
    }
  }

  /**
   * Assigns shoe variants to a product.
   * @param shoeVariantData - The shoe variant data.
   * @param productId - The ID of the product.
   * @param shopId - The ID of the shop (optional).
   */
  public async shoeVariantsAssign(
    shoeVariantData: productVariantInterface,
    productId: string,
    shopId?: string,
  ) {
    const {
      price,
      color_list,
      shoe_sizes,
      shoe_bundles,
      shoe_bundle_name,
      isPreOrder,
      product_id,
      sizeChartId,
    } = shoeVariantData;

    const sizes = getShoeSizes(shoe_sizes);
    const productVariants = [];
    let shoeVariantIdMapping: Record<string, string[]> = {};

    // Transform sizes and colors into shoe variants
    for (const size of sizes) {
      const variants = await this.transformerClass.shoeVariantTransformer(
        size,
        color_list,
        isPreOrder,
        price,
      );
      productVariants.push(...variants);
    }

    // Add SKU for product variants
    await addSkuToProductVariants(
      await createSkuHandler(productVariants, product_id, sizeChartId),
      productVariants,
    );

    if (productVariants.length) {
      // Create variants
      const variantIds = await createBulkVariantsHandler(
        productVariants,
        productId,
      );

      if (variantIds) {
        // Map variant IDs according to sizes
        shoeVariantIdMapping = getShoeVariantsMapping(
          shoe_sizes,
          variantIds,
          color_list,
        );

        // Create bundles
        for (let i = 0; i < shoe_bundles.length; i++) {
          const bundle = shoe_bundles[i];
          const bundleName = shoe_bundle_name[i];

          await this.createShoeBundles({
            shoeVariantIdMapping,
            bundle,
            shopId,
            color_list,
            bundleName,
            productId,
            price: price.salePrice as number,
          });
        }
      }
    }
  }

  /**
   * Creates shoe bundles based on the provided parameters.
   * @param shoeVariantIdMapping - The mapping of shoe variant IDs.
   * @param bundle - The bundle configuration.
   * @param shopId - The ID of the shop.
   * @param color_list - The list of colors.
   * @param bundleName - The name of the bundle.
   * @param productId - The ID of the product.
   * @returns A promise that resolves to an array of created bundles.
   */
  private async createShoeBundles({
    shoeVariantIdMapping,
    bundle,
    shopId,
    color_list,
    bundleName,
    productId,
    price,
  }: {
    shoeVariantIdMapping: Record<string, string[]>;
    bundle: Record<string, string>;
    shopId: string;
    color_list: colorListInterface[];
    bundleName: string;
    productId: string;
    price: number;
  }) {
    const quantities: string[] = Object.values(bundle);

    // Get bundle variant IDs split by color and sizes from the mapped variant IDs
    const bundleVariantIds = getShoeBundlesBySizes(
      shoeVariantIdMapping,
      bundle,
      color_list.length,
    );

    this.logger.log('Bundle Variant IDs:', bundleVariantIds);

    // Create the shoe bundles
    const createBundles = await Promise.all(
      (bundleVariantIds || []).map(async (variants) => {
        const bundleQuantities = quantities.map((str) => Number(str));
        const bundlePrice = getBundlePrice(bundleQuantities, price);
        this.logger.log('Creating shoe bundles', bundleQuantities);
        await this.bundleRepository.createBundles(
          variants,
          bundleQuantities,
          shopId,
          productId,
          bundlePrice,
          false,
          bundleName['ShoeSizeName'] || bundleName,
        );

        this.logger.log('Created bundle:', variants);
      }),
    );

    this.logger.log('All bundles created:', createBundles);

    return createBundles;
  }

  /**
   * Synchronizes colors between a source product and its corresponding destination product.
   * Deletes variants and bundles associated with deactivated colors.
   *
   * @param {string} sourceProductId - The ID of the source product.
   * @returns {Promise<object>} - A promise that resolves to an array of deleted bundle IDs.
   */
  public async syncColors(sourceProductId: string): Promise<object> {
    // Retrieve the ID of the corresponding destination product
    const destinationProductId = await getProductMapping(sourceProductId);

    // If no destination product is found, return an empty array
    if (!destinationProductId) {
      return [];
    }

    // Transform source product variant data
    const sourceVariantsData =
      await this.transformerClass.productViewTransformer(
        await getProductDetailsFromDb(sourceProductId),
      );

    // Retrieve the variant data for the destination product
    const destinationVariantData = (
      await getProductDetailsHandler(destinationProductId)
    ).variants as VariantsListInterface[];

    // Generate a mapping of destination variants by color
    const destinationColorMapping = destinationVariantsByColor(
      destinationVariantData,
    );

    // Validate the colors of the source variants against the destination color mapping
    const validateColor = validateProductColors(
      sourceVariantsData,
      destinationColorMapping,
    );

    // If no colors require validation, return an empty array
    if (!validateColor) {
      return [];
    }

    this.logger.log(
      `Deleting variants against deactivated colors, destination id ${destinationProductId}, source id ${sourceProductId}`,
      validateColor,
    );
    this.logger.log(
      `Source colors for product ${sourceProductId}`,
      sourceVariantsData.color_list.map((color) => color.cColorName),
    );
    this.logger.log(
      `Destination colors for product ${destinationProductId}`,
      destinationColorMapping,
    );

    // Retrieve bundle IDs associated with deactivated colors
    const bundleIds = await getBundleIdsHandler(
      destinationProductId,
      validateColor,
    );

    // Delete the bundles associated with the deactivated colors
    const deleteBundles = Promise.all(bundleIds.map(deleteBundleHandler));
    this.logger.log(
      'Deleted bundles associated with deactivated colors',
      bundleIds,
    );

    // Delete variants with deactivated colors
    const deleteVariants = await productVariantBulkDeleteHandler(validateColor);
    this.logger.log('Removed variants with deactivated colors', deleteVariants);

    // Return the deleted bundle IDs
    return deleteBundles;
  }
}
