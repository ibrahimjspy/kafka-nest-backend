import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  addOrangeShineIdMutation,
  createProductMutation,
} from '../queries/createProduct';

export const createProductHandler = async (productData) => {
  try {
    //TODO add product transformation class and methods on compositeProductData
    const createProduct = await graphqlCall(createProductMutation(productData));
    const registerOrangeShineId = await graphqlCall(
      addOrangeShineIdMutation(createProduct, productData),
    );
    return { ...createProduct, ...registerOrangeShineId };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
