import { Injectable } from '@nestjs/common';
import {
  addProductVariantToShopHandler,
  createBulkVariantsHandler,
} from 'src/graphql/handlers/productVariant';
import { fetchProductId } from 'src/postgres/handlers/product';
import { TransformerService } from 'src/transformer/Transformer.service';
import { productVariantInterface } from 'src/types/mssql/product';
import { colorSelectDto } from 'src/types/transformers/product';
import { getProductDetailsFromDb } from 'src/mssql/product.fetch';
import { createBundleHandler } from 'src/graphql/handlers/bundle';

/**
 *  Injectable class handling productVariant and its relating tables CDC
 *  @Injected transformation class for CDC payload validations and transformations
 *  @requires Injectable in app scope or in kafka connection to reach kafka messages
 */
@Injectable()
export class ProductVariantService {
  constructor(private readonly transformerClass: TransformerService) {}

  public healthCheck(): string {
    return 'Service running';
  }
  public async handleSelectColorCDC(productColorData: colorSelectDto) {
    const sourceId = productColorData.TBItem_ID;

    // fetching product variant additional information
    const productVariantData: productVariantInterface =
      await getProductDetailsFromDb(sourceId);
    const productId = await fetchProductId(sourceId);

    // creating product variant against color
    return await this.productVariantAssign(productVariantData, productId);
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
}

// convert array into smaller chunks  [ab, bc, cd] =>  [[ab,bc],[cd]]
const chunkArray = (arr, size) =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr];
