import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { updateProductQuery } from '../queries/updateProduct';

export const updateProduct = async (productUpdateData) => {
  try {
    //TODO add product transformation class and methods on compositeProductData
    return await graphqlCall(updateProductQuery(productUpdateData));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
