//  <-->  Create  <-->

import { graphqlCall, graphqlExceptionHandler } from '../utils/call';
import { createSkuMutation } from '../mutations/sku/create';
import { getProductVariantsForSku } from 'src/services/product/variant/Product.Variant.utils';

export const createSkuHandler = async (
  productVariants,
  productId: string,
  sizeChartId: number,
): Promise<object> => {
  try {
    const skuData = await graphqlCall(
      createSkuMutation(
        getProductVariantsForSku(productVariants, productId, sizeChartId),
      ),
    );
    return skuData['skuForProductVariants']['productVariants'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
