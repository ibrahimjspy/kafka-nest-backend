import { Logger } from '@nestjs/common';
import {
  getProductDetailsInterface,
  productCreate,
} from 'src/graphql/types/product';
import { productTransformed } from 'src/transformer/types/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/graphql/utils/call';
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
    const productId = createProduct?.productCreate?.product?.id;
    await productChannelListing(productId);

    Logger.verbose('Product created', createProduct);
    return productId;
  } catch (err) {
    Logger.error('Product create call failed', graphqlExceptionHandler(err));
    return;
  }
};

export const productChannelListing = async (productId) => {
  try {
    return await graphqlCall(productChannelListingMutation(productId));
  } catch (err) {
    Logger.warn(
      'product channel update call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};
//  <-->  Read  <-->

export const getProductDetailsHandler = async (productId: string) => {
  try {
    const getProductDetails: getProductDetailsInterface = await graphqlCall(
      getProductDetailsQuery(productId),
    );
    const { slug, variants, media } = getProductDetails.product;
    return { slug, variants, media };
  } catch (err) {
    Logger.warn('Product fetch call failed', graphqlExceptionHandler(err));
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
    Logger.warn('Product update call failed', graphqlExceptionHandler(err));
    return;
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
