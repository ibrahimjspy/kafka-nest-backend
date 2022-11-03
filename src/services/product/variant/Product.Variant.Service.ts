import { Injectable, Logger } from '@nestjs/common';
import {
  createProductVariantHandler,
  updateProductVariantPricingHandler,
} from 'src/graphql/handlers/productVariant';
import { fetchProductId } from 'src/postgres/handlers/product';
import { TransformerService } from 'src/transformer/Transformer.service';
import { productVariantInterface } from 'src/types/mssql/product';
import { colorSelectDto } from 'src/types/transformers/product';
import { getProductDetailsFromDb } from 'src/mssql/product.fetch';
import { createBundleHandler } from 'src/graphql/handlers/bundle';
import { bundleVariantInterface } from 'src/types/graphql/bundles';
import { PromisePool } from '@supercharge/promise-pool';

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
    const bundlesObject = {};
    if (color_list) {
      await PromisePool.for(color_list)
        .withConcurrency(2)
        .onTaskStarted((color, pool) => {
          Logger.log(
            `product variant progress: ${pool.processedPercentage()}%`,
          );
          Logger.log(
            `product variant finished tasks: ${pool.processedCount()}`,
          );
        })
        .process(async (color: string) => {
          bundlesObject[color] = [];
          const variants =
            await this.transformerClass.productVariantTransformer(color, sizes);
          await Promise.all(
            variants.map(async (variant, key) => {
              const bundle: bundleVariantInterface = {};
              const productVariant = await createProductVariantHandler(
                variant,
                productId,
                shopId,
              );
              if (productVariant) {
                // assign variant pricing
                await updateProductVariantPricingHandler(
                  productVariant,
                  price.regular_price,
                );
                // assign bundle information
                bundle.variantId = productVariant;
                bundle.quantity = Number(pack_name.split('-')[key]);
                bundlesObject[color].push(bundle);
              }
            }),
          );
        });
      return await this.createBundles(color_list, bundlesObject, shopId);
    }
  }

  private async createBundles(color_list, bundlesObject, shopId) {
    const createBundles = await Promise.all(
      color_list.map(async (c) => {
        await createBundleHandler(bundlesObject[c], shopId);
      }),
    );
    return createBundles;
  }
}
