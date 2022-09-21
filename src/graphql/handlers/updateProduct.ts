import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { updateProductQuery } from '../queries/updateProduct';

export const updateProduct = async (productUpdateData) => {
  try {
    return await graphqlCall(updateProductQuery(productUpdateData));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
