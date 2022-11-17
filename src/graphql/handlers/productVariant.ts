import { Logger } from '@nestjs/common';
import { bulkVariantCreate } from 'src/graphql/types/product';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import {
  addProductVariantToShopMutation,
  productVariantBulkCreateMutation,
} from '../mutations/productVariant/create';
import { productDeleteById } from 'src/services/product/Product.utils';
import { productVariantQueryTransformer } from '../utils/transformers';

//  <-->  Create  <-->
export const createBulkVariantsHandler = async (
  productVariantData,
  productId,
) => {
  try {
    const variantIds = [];

    const createProductVariants: bulkVariantCreate = await graphqlCall(
      productVariantBulkCreateMutation(
        productVariantQueryTransformer(productVariantData),
        productId,
      ),
    );
    createProductVariants.productVariantBulkCreate.productVariants.map(
      (variant) => [variantIds.push(variant.id)],
    );

    return variantIds;
  } catch (err) {
    Logger.warn('product variant call failed', graphqlExceptionHandler(err));
    await productDeleteById(productId);
    return;
  }
};

export const addProductVariantToShopHandler = async (
  productVariantId,
  shopId,
) => {
  try {
    if (productVariantId) {
      await graphqlCall(
        addProductVariantToShopMutation(productVariantId, shopId),
      );
    }
  } catch (err) {
    Logger.error(
      'product variant add to shop call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};
