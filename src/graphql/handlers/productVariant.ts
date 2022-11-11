import { Logger } from '@nestjs/common';
import { bulkVariantCreate } from 'src/types/graphql/product';
import { productDeleteById } from 'src/utils/core/productDelete';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import {
  addProductVariantToShopMutation,
  productVariantBulkCreateMutation,
} from '../mutations/productVariant/create';

//  <-->  Create  <-->
export const createBulkVariantsHandler = async (
  productVariantData,
  productId,
  retry = 0,
) => {
  try {
    const variantIds = [];
    if (retry !== 0) {
      Logger.warn(`${retry} in product variant retry call`, {
        productVariantData,
      });
    }

    const createProductVariants: bulkVariantCreate = await graphqlCall(
      productVariantBulkCreateMutation(productVariantData, productId),
    );
    createProductVariants.productVariantBulkCreate.productVariants.map(
      (variant) => [variantIds.push(variant.id)],
    );

    return variantIds;
  } catch (err) {
    if (retry == 4) {
      Logger.warn('product variant call failed', graphqlExceptionHandler(err));
      await productDeleteById(productId);
      return;
    }
    return await createBulkVariantsHandler(
      productVariantData,
      productId,
      retry + 1,
    );
  }
};

export const addProductVariantToShopHandler = async (
  productVariantId,
  shopId,
  retry = 0,
) => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in product variant add to Shop`, {
        productVariantId,
      });
    }
    if (productVariantId) {
      await graphqlCall(
        addProductVariantToShopMutation(productVariantId, shopId),
      );
    }
  } catch (err) {
    if (retry > 7) {
      Logger.error(
        'product variant add to shop call failed',
        graphqlExceptionHandler(err),
      );
      return;
    }
    return await addProductVariantToShopHandler(
      productVariantId,
      shopId,
      retry + 1,
    );
  }
};
