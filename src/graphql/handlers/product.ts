import {
  deleteProductId,
  insertProductId,
} from 'src/postgres/handlers/product';
import { productCDC } from 'src/types/Product';
import { graphqlCall, graphqlExceptionHandler } from 'src/utils/graphqlHandler';
import { createProductMutation } from '../mutations/product/create';
import { deleteProductMutation } from '../mutations/product/delete';
import { updateProductQuery } from '../mutations/product/update';

//  <-->  Create  <-->

export const createProductHandler = async (
  productData: productCDC,
): Promise<object> => {
  try {
    const createProduct: object = await graphqlCall(
      createProductMutation(productData),
    );
    console.log(createProduct);
    insertProductId(productData.TBItem_ID, createProduct);
    return { ...createProduct };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Update  <-->

export const updateProductHandler = async (
  productUpdateData: productCDC,
  destinationId: string,
): Promise<object> => {
  try {
    return await graphqlCall(
      updateProductQuery(productUpdateData, destinationId),
    );
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Delete  <-->

export const deleteProductHandler = async (
  productId: string,
): Promise<object> => {
  try {
    const data = await graphqlCall(deleteProductMutation(productId));
    await deleteProductId(productId);
    console.log(data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
