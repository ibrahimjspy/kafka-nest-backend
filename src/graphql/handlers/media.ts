import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';

export const updateProductMedia = async (
  productData: object,
  productId: string,
) => {
  try {
    return await graphqlCall(updateProductMedia(productData, productId));
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};