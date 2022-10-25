import { Logger } from '@nestjs/common';
import { productDetails, productTransformed } from 'src/types/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import { createProductMutation } from '../mutations/product/create';
import { deleteProductMutation } from '../mutations/product/delete';
import { updateProductMutation } from '../mutations/product/update';
import { productDetailsByIdQuery } from '../queries/product';

//  <-->  fetch  <-->

export const fetchProductSlugById = async (productId: string) => {
  try {
    const product: productDetails = await graphqlCall(
      productDetailsByIdQuery(productId),
    );
    Logger.verbose('Product fetched', product);
    return product.product.slug;
  } catch (err) {
    Logger.warn('Product fetch call failed', err);
    return null;
  }
};

//  <-->  Create  <-->

export const createProductHandler = async (
  productData: productTransformed,
): Promise<object> => {
  try {
    const createProduct: object = await graphqlCall(
      createProductMutation(productData),
    );
    Logger.verbose('Product created', createProduct);
    return { ...createProduct };
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};

//  <-->  Update  <-->

export const updateProductHandler = async (
  productUpdateData: productTransformed,
  destinationId: string,
): Promise<object> => {
  try {
    const productUpdate = await graphqlCall(
      updateProductMutation(productUpdateData, destinationId),
    );
    Logger.verbose('Product updated', productUpdate);
    return productUpdate;
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
    Logger.warn('Product deleted', data);
  } catch (err) {
    return graphqlExceptionHandler(err);
  }
};
