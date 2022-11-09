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
  retry = 0,
): Promise<string> => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in create product call`, {
        productData,
      });
    }

    const createProduct: productCreate = await graphqlCall(
      createProductMutation(productData),
    );
    const productId = createProduct?.productCreate?.product?.id;
    await productChannelListing(productId);

    // Logger.verbose('Product created', createProduct);
    return productId;
  } catch (err) {
    if (retry == 3) {
      Logger.error('Product create call failed', graphqlExceptionHandler(err));
      return;
    }
    return await createProductHandler(productData, retry + 1);
  }
};

export const productChannelListing = async (productId, retry = 0) => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in product channel listing update`, {
        productId,
      });
    }
    await graphqlCall(productChannelListingMutation(productId));
  } catch (err) {
    if (retry == 4) {
      Logger.warn(
        'product channel update call failed',
        graphqlExceptionHandler(err),
      );
      return;
    }
    return await productChannelListing(productId, retry + 1);
  }
};
//  <-->  Read  <-->

export const getProductSlugById = async (productId: string, retry = 0) => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in product details get call`, {
        productId,
      });
    }
    const product: getProductDetails = await graphqlCall(
      getProductDetailsQuery(productId),
    );
    // Logger.verbose('Product fetched', product);
    return product.product.slug;
  } catch (err) {
    if (retry == 4) {
      Logger.warn('Product fetch call failed', graphqlExceptionHandler(err));
      return;
    }
    return await productChannelListing(productId, retry + 1);
  }
};

//  <-->  Update  <-->

export const updateProductHandler = async (
  productUpdateData: productTransformed,
  destinationId: string,
  retry = 0,
): Promise<object> => {
  try {
    if (retry !== 0) {
      Logger.warn(`${retry} retry in product update  call`, {
        destinationId,
      });
    }
    const productUpdate = await graphqlCall(
      updateProductMutation(productUpdateData, destinationId),
    );
    // Logger.verbose('Product updated', productUpdate);
    return productUpdate;
  } catch (err) {
    if (retry == 4) {
      Logger.warn('Product update call failed', graphqlExceptionHandler(err));
      return;
    }
    return await updateProductHandler(
      productUpdateData,
      destinationId,
      retry + 1,
    );
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
