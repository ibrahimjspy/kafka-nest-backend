import { Logger } from '@nestjs/common';
import { bulkVariantCreate } from 'src/graphql/types/product';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import {
  addProductVariantToShopMutation,
  productVariantBulkCreateMutation,
} from '../mutations/productVariant/create';
import { productVariantQueryTransformer } from '../utils/transformers';
import { deleteProductHandler } from './product';
import { deleteProductIdByDestinationId } from 'src/database/postgres/handlers/product';
import { updateProductVariantPricingMutation } from '../mutations/productVariant/update';

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
    await deleteProductHandler(productId); // rollback <api>
    await deleteProductIdByDestinationId(productId); // rollback <db>
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

//  <-->  Update  <-->

export const updateProductVariantPriceHandler = async (
  productVariantId,
  productVariantPrice,
) => {
  try {
    if (productVariantId) {
      await graphqlCall(
        updateProductVariantPricingMutation(
          productVariantId,
          productVariantPrice,
        ),
      );
    }
  } catch (err) {
    Logger.error(
      'product variant pricing update call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};
