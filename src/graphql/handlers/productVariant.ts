import { Logger } from '@nestjs/common';
import { productVariantCreate } from 'src/types/graphql/product';
import { productDeleteById } from 'src/utils/core/productDelete';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createProductVariantMutation } from '../mutations/productVariant/create';
import { updateProductVariantPricingMutation } from '../mutations/productVariant/update';

//  <-->  Create  <-->

export const createProductVariantHandler = async (
  productVariantData,
  productId,
): Promise<string> => {
  try {
    const createProductVariant: productVariantCreate = await graphqlCall(
      createProductVariantMutation(productVariantData, productId),
    );
    Logger.verbose('Product variant created', createProductVariant);

    const productVariantId =
      createProductVariant.productVariantCreate?.productVariant?.id;
    return productVariantId;
  } catch (err) {
    await productDeleteById(productId);
    Logger.warn('product variant call failed', err);
  }
};

//  <-->  Update  <-->

export const updateProductVariantPricingHandler = async (
  productVariantId,
  priceAmount,
): Promise<object> => {
  try {
    console.log(productVariantId, ' variant id');
    const updateProductVariantPricing: object = await graphqlCall(
      updateProductVariantPricingMutation(productVariantId, priceAmount),
    );
    Logger.log('Product variant price updated', updateProductVariantPricing);
    return { ...updateProductVariantPricing };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
