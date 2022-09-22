import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductMutation } from '../queries/createProduct';

export const createProductMutationHandler = async (
  productData,
  message_nature: string,
) => {
  try {
    return await graphqlCall(createProductMutation(productData));
    console.log(message_nature);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
