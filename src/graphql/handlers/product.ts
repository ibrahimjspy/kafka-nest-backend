import { Logger } from '@nestjs/common';
import { getProductDetails, productCreate } from 'src/types/graphql/product';
import { productTransformed } from 'src/types/transformers/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/utils/graphql/handler';
import {
  createProductMutation,
  productChannelListingMutation,
} from '../mutations/product/create';
import { deleteProductMutation } from '../mutations/product/delete';
import { updateProductMutation } from '../mutations/product/update';
import { getProductDetailsQuery } from '../queries/product';

//  <-->  Create  <-->

export const createProductHandler = async (
  productData: productTransformed,
): Promise<string> => {
  try {
    const createProduct: productCreate = await graphqlCall(
      createProductMutation(productData),
    );
    await graphqlCall(productChannelListingMutation(createProduct));
    const productId = createProduct?.productCreate?.product?.id;

    Logger.verbose('Product created', createProduct);
    return productId;
  } catch (err) {
    Logger.warn('Product create call failed', err);
    return null;
  }
};

//  <-->  Read  <-->

export const getProductSlugById = async (productId: string) => {
  try {
    const product: getProductDetails = await graphqlCall(
      getProductDetailsQuery(productId),
    );
    Logger.verbose('Product fetched', product);
    return product.product.slug;
  } catch (err) {
    Logger.warn('Product fetch call failed', err);
    return null;
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
