import { Injectable, Logger } from '@nestjs/common';
import {
  createProductVariantHandler,
  updateProductVariantPricingHandler,
} from 'src/graphql/handlers/productVariant';
import { fetchProductId } from 'src/postgres/handlers/product';
import { TransformerService } from 'src/transformer/Transformer.service';
import { colorSelect, productVariantCDC } from 'src/types/product';
import { getProductDetails } from 'src/utils/mssql/fetch';
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
  public async handleSelectColorCDC(productColorData: colorSelect) {
    const sourceId = productColorData.TBItem_ID;
    // fetching product variant additional information
    const productVariantData: productVariantCDC = await getProductDetails(
      sourceId,
    );
    const productId = await fetchProductId(sourceId);
    // creating product variant against color
    return await this.productVariantAssign(productVariantData, productId);
  }

  public async productVariantAssign(
    productVariantData: productVariantCDC,
    productId: string,
  ) {
    const { sizes, price, color_list } = productVariantData;
    Promise.all(
      color_list.map(async (color) => {
        const variants = await this.transformerClass.productColorTransformer(
          color,
          sizes,
        );
        await Promise.all(
          variants.map(async (variant) => {
            Logger.log(variant);
            const productVariant = await createProductVariantHandler(
              variant,
              productId,
            );
            await updateProductVariantPricingHandler(
              productVariant,
              price.regular_price,
            );
          }),
        );
      }),
    );
  }
}
