//  <-->  Create  <-->

import { graphqlCall, graphqlExceptionHandler } from '../utils/call';
import { createSkuMutation } from '../mutations/sku/create';
import { getProductVariantsForSku } from 'src/services/product/variant/Product.Variant.utils';

export const createSkuHandler = async (
  productVariants,
  productName,
): Promise<object> => {
  try {
    const skuData = await graphqlCall(
      createSkuMutation(getProductVariantsForSku(productVariants, productName)),
    );
    return skuData['skuForProductVariants']['productVariants'];
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
