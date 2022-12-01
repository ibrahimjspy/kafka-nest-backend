import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  addProductVariantToShopHandler,
  createBulkVariantsHandler,
  updateProductVariantPriceHandler,
} from 'src/graphql/handlers/productVariant';
import { fetchProductId } from 'src/database/postgres/handlers/product';
import { TransformerService } from 'src/transformer/Transformer.service';
import { productVariantInterface } from 'src/database/mssql/types/product';
import {
  colorSelectDto,
  productTransformed,
} from 'src/transformer/types/product';
import { getProductDetailsFromDb } from 'src/database/mssql/product-view/fetch';
import { createBundleHandler } from 'src/graphql/handlers/bundle';
import {
  chunkArray,
  getShoeBundlesBySizes,
  getShoeSizes,
  getShoeVariantsMapping,
} from '../Product.utils';
import { ProductService } from '../Product.Service';
import { getProductDetailsHandler } from 'src/graphql/handlers/product';

/**
 *  Injectable class handling productVariant and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductVariantService {
  constructor(
    private readonly transformerClass: TransformerService,
    @Inject(forwardRef(() => ProductService))
    private readonly productClass: ProductService,
  ) {}

  public async handleSelectColorCDC(productColorData: colorSelectDto) {
    const sourceId = productColorData.TBItem_ID;
    // fetching product variant additional information
    const productVariantData: productVariantInterface =
      await getProductDetailsFromDb(sourceId);
    const productId = await fetchProductId(sourceId);

    // creating product variant against color
    return await this.productVariantAssign(productVariantData, productId);
  }

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

  public async productVariantAssign(
    productVariantData: productVariantInterface,
    productId: string,
    shopId?: string,
  ) {
    const { sizes, price, color_list, pack_name } = productVariantData;
    let productVariants = [];

    if (color_list) {
      // TRANSFORM PRODUCT VARIANTS
      await color_list.map(async (color) => {
        const variants = await this.transformerClass.productVariantTransformer(
          color,
          sizes,
          price.regular_price,
        );
        productVariants = [...productVariants, ...variants];
      });
      if (productVariants.length > 0) {
        // CREATE VARIANTS
        const variantIds = await createBulkVariantsHandler(
          productVariants,
          productId,
        );

        // CREATE BUNDLES
        await this.createBundles(variantIds, pack_name.split('-'), shopId);

        // ADD PRODUCT VARIANTS TO SHOP
        await Promise.all(
          variantIds.map(async (id) => {
            addProductVariantToShopHandler(id, shopId);
          }),
        );
      }
    }
    return;
  }

  private async createBundles(variantIds, bundle, shopId) {
    // Filters variantIds array according to bundles
    const bundleVariantIds = chunkArray(variantIds, bundle.length);
    const createBundles = await Promise.all(
      bundleVariantIds.map(async (variants) => {
        await createBundleHandler(variants, bundle, shopId);
      }),
    );
    return createBundles;
  }

  private async updatePrice(sourcePrice, destinationProductData) {
    if (
      parseFloat(sourcePrice) !==
      parseFloat(destinationProductData.variants[0].pricing.price.gross.amount)
    ) {
      await Promise.all(
        destinationProductData.variants.map(async (variant) => {
          await updateProductVariantPriceHandler(
            variant.id,
            parseFloat(sourcePrice),
          );
        }),
      );
    }
  }

  public async shoeVariantsAssign(
    shoeVariantData: productVariantInterface,
    productId: string,
    shopId?: string,
  ) {
    const { price, color_list, shoe_sizes, shoe_bundles } = shoeVariantData;
    let sizes = [];
    let productVariants = [];
    let shoeVariantIdMapping = {}; // VARIANT ID MAPPED AGAINST SHOE SIZE

    sizes = getShoeSizes(shoe_sizes);
    // TRANSFORM SIZES AND COLORS
    await sizes.map(async (size) => {
      const variants = await this.transformerClass.shoeVariantTransformer(
        size,
        color_list,
        price.regular_price,
      );
      productVariants = [...productVariants, ...variants];
    });
    if (productVariants.length > 0) {
      // CREATE VARIANTS
      const variantIds = await createBulkVariantsHandler(
        productVariants,
        productId,
      );
      // MAP VARIANT IDS ACCORDING TO SIZES
      shoeVariantIdMapping = getShoeVariantsMapping(
        shoe_sizes,
        variantIds,
        color_list,
      );
      // CREATE BUNDLES
      shoe_bundles.map(async (bundle) => {
        await this.createShoeBundles(
          shoeVariantIdMapping,
          bundle,
          shopId,
          color_list,
        );
      });

      // ADD PRODUCT VARIANTS TO SHOP
      await Promise.all(
        variantIds.map(async (id) => {
          addProductVariantToShopHandler(id, shopId);
        }),
      );
    }
  }

  private async createShoeBundles(variantIds, bundle, shopId, colorList) {
    const quantities = Object.values(bundle);
    // GET BUNDLE VARIANT IDS SPLITTED AGAINST COLOR SIZES FROM MAPPED VARIANT IDS
    const bundleVariantIds = getShoeBundlesBySizes(
      variantIds,
      bundle,
      colorList.length,
    );
    const createBundles = await Promise.all(
      bundleVariantIds.map(async (variants, key) => {
        await createBundleHandler(
          variants,
          quantities,
          shopId,
          `bundle ${key + 1}`,
        );
      }),
    );
    return createBundles;
  }
}
