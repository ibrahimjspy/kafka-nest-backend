import { Injectable, Logger } from '@nestjs/common';
import { createProductVariantHandler } from 'src/graphql/handlers/productVariant';
import { mockColor, mockSize } from 'src/mock/product/variant';
import { fetchProductId } from 'src/postgres/handlers/product';
import { TransformerService } from 'src/transformer/Transformer.service';
import { colorSelect } from 'src/types/product';
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
    // fetching product variant additional information
    const productColor = mockColor[0].name;
    const productSizes = mockSize.size;
    const productId = await fetchProductId(productColorData.TBItem_ID);
    // creating product variant against color
    return await this.productVariantAssign(
      productColor,
      productSizes,
      productId,
    );
  }

  public async productVariantAssign(
    productColor: string,
    productSizes: string[],
    productId: string,
  ) {
    const variants = await this.transformerClass.productColorTransformer(
      productColor,
      productSizes,
    );
    const createMedia = Promise.all(
      variants.map(async (variant) => {
        Logger.log(variant);
        await createProductVariantHandler(variant, productId);
      }),
    );
    return createMedia;
  }
}
