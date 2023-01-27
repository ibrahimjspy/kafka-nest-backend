import { Logger } from '@nestjs/common';
import { bulkVariantCreate } from 'src/graphql/types/product';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import {
  addProductVariantsToShopMutation,
  productVariantBulkCreateMutation,
} from '../mutations/productVariant/create';
import { productVariantQueryTransformer } from '../utils/transformers';
import { deleteProductHandler } from './product';
import {
  updateProductVariantCostAttributeMutation,
  updateProductVariantPricingMutation,
} from '../mutations/productVariant/update';
import { validateProductVariants } from 'src/services/product/variant/Product.Variant.utils';
import { removeProductMapping } from 'src/mapping/methods/product';

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
    return await validateProductVariants(variantIds, productId);
  } catch (err) {
    Logger.warn('product variant call failed', graphqlExceptionHandler(err));
    await deleteProductHandler(productId); // rollback <api>
    await removeProductMapping(productId); // rollback <mapping>
    return;
  }
};

export const addProductVariantToShopHandler = async (
  productVariantIds,
  shopId,
) => {
  try {
    if (productVariantIds) {
      await graphqlCall(
        addProductVariantsToShopMutation(productVariantIds, shopId),
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
  productVariantResalePrice,
) => {
  try {
    if (productVariantId) {
      await graphqlCall(
        updateProductVariantPricingMutation(
          productVariantId,
          productVariantResalePrice,
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

export const updateProductVariantAttributeCostHandler = async (
  productVariantId,
  productVariantCostPrice,
) => {
  try {
    if (productVariantId) {
      await graphqlCall(
        updateProductVariantCostAttributeMutation(
          productVariantId,
          productVariantCostPrice,
        ),
      );
    }
  } catch (err) {
    Logger.error(
      'product variant pricing attribute update call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};
