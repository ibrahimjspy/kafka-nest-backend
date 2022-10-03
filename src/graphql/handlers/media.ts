import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductMediaMutation } from '../mutations/updateMedia';

export const updateProductMedia = async (
  productData: object,
  productId: string,
) => {
  try {
    return await graphqlCall(
      createProductMediaMutation(productData, productId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
