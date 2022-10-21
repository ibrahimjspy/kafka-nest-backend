import { Logger } from '@nestjs/common';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createProductVariantMutation } from '../mutations/productVariant/create';

export const createProductVariantHandler = async (
  productVariantData,
  productId,
): Promise<object> => {
  try {
    const createProductVariant: object = await graphqlCall(
      createProductVariantMutation(productVariantData, productId),
    );
    Logger.verbose('Product variant created', createProductVariant);
    return { ...createProductVariant };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
