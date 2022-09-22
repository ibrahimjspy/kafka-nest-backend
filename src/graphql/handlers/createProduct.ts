import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductMutation } from '../queries/createProduct';

export const createProductHandler = async (productData) => {
  try {
    return await graphqlCall(createProductMutation(productData));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
