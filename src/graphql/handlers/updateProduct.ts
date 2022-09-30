import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { updateProductQuery } from '../mutations/updateProduct';

export const updateProduct = async (productUpdateData: object) => {
  try {
    return await graphqlCall(updateProductQuery(productUpdateData));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
