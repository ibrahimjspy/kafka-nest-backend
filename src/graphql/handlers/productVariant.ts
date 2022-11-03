import { Logger } from '@nestjs/common';
import { productVariantCreate } from 'src/types/graphql/product';
import { productDeleteById } from 'src/utils/core/productDelete';
import {
  graphqlCall,
  graphqlCallSaleor,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createProductVariantMutation } from '../mutations/productVariant/create';
import { updateProductVariantPricingMutation } from '../mutations/productVariant/update';
import { addProductVariantToShopMutation } from '../mutations/shop/create';

//  <-->  Create  <-->

export const createProductVariantHandler = async (
  productVariantData,
  productId,
  shopId,
  retry = 0,
): Promise<string> => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} in product variant retry call`, {
        productVariantData,
      });
    }

    const createProductVariant: productVariantCreate = await graphqlCallSaleor(
      createProductVariantMutation(productVariantData, productId),
    );
    const productVariantId =
      createProductVariant.productVariantCreate?.productVariant?.id;
    await addProductVariantToShopHandler(productVariantId, shopId);
    Logger.verbose('Product variant created', createProductVariant);

    return productVariantId;
  } catch (err) {
    if (retry == 2) {
      Logger.warn('product variant call failed', graphqlExceptionHandler(err));
      await productDeleteById(productId);
      return;
    }
    return await createProductVariantHandler(
      productVariantData,
      productId,
      shopId,
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
      const addVariantToShop = await graphqlCall(
        addProductVariantToShopMutation(productVariantId, shopId),
      );
      Logger.verbose('Product variant added to shop', addVariantToShop);
    }
  } catch (err) {
    if (retry == 2) {
      Logger.warn(
        'product channel update call failed',
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

//  <-->  Update  <-->

export const updateProductVariantPricingHandler = async (
  productVariantId: string,
  priceAmount: number,
  retry = 0,
): Promise<object> => {
  try {
    const updateProductVariantPricing: object = await graphqlCall(
      updateProductVariantPricingMutation(productVariantId, priceAmount),
    );
    Logger.log('Product variant price updated', updateProductVariantPricing);
    return { ...updateProductVariantPricing };
  } catch (err) {
    if (retry == 2) {
      Logger.warn(
        'product variant pricing call failed',
        graphqlExceptionHandler(err),
      );
      return;
    }
    return await updateProductVariantPricingHandler(
      productVariantId,
      priceAmount,
      retry + 1,
    );
  }
};
