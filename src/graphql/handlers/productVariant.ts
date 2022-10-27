import { Logger } from '@nestjs/common';
import { productVariantCreate } from 'src/types/product';
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
): Promise<string | object> => {
  try {
    const createProductVariant: productVariantCreate = await graphqlCall(
      createProductVariantMutation(productVariantData, productId),
    );
    Logger.verbose('Product variant created', createProductVariant);
    return createProductVariant.productVariantCreate?.productVariant?.id;
  } catch (err) {
    return graphqlExceptionHandler(err);
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
