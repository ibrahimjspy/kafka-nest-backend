import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import {
  addOrangeShineIdMutation,
  createProductMutation,
} from '../mutations/createProduct';

export const createProductHandler = async (productData: object) => {
  try {
    const createProduct = await graphqlCall(createProductMutation(productData));
    const registerOrangeShineId = await graphqlCall(
      addOrangeShineIdMutation(createProduct, productData),
    );
    console.log(createProduct);
    console.log(registerOrangeShineId);
    return { ...createProduct, ...registerOrangeShineId };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
