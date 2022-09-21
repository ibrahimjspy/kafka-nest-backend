import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductMediaMutation } from '../queries/updateMedia';

export const updateProductMedia = async (productData, productId) => {
  try {
    return await graphqlCall(
      createProductMediaMutation(productData, productId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
