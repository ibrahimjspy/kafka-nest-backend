import { Logger } from '@nestjs/common';
import {
  getProductDetailsInterface,
  productCreate,
} from 'src/graphql/types/product';
import { productTransformed } from 'src/transformer/types/product';
import {
  graphqlCall,
  graphqlExceptionHandler,
} from 'src/graphql/graphql.utils';
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
    const createProduct: productCreate = await graphqlCall(
      createProductMutation(productData),
    );
    const productId = createProduct?.productCreate?.product?.id;
    await productChannelListing(productId);

    Logger.verbose('Product created', createProduct);
    return productId;
  } catch (err) {
    if (retry == 3) {
      Logger.error('Product create call failed', graphqlExceptionHandler(err));
      return;
    }
    Logger.warn(`${retry + 1} retry in create product call`, {
      productData,
    });
    return await createProductHandler(productData, retry + 1);
  }
};

export const productChannelListing = async (productId, retry = 0) => {
  try {
    return await graphqlCall(productChannelListingMutation(productId));
  } catch (err) {
    if (retry == 4) {
      Logger.warn(
        'product channel update call failed',
        graphqlExceptionHandler(err),
      );
      return;
    }
    Logger.warn(`${retry + 1} retry in product channel listing update`, {
      productId,
    });
    return await productChannelListing(productId, retry + 1);
  }
};
//  <-->  Read  <-->

export const getProductDetailsHandler = async (
  productId: string,
  retry = 0,
) => {
  try {
    const getProductDetails: getProductDetailsInterface = await graphqlCall(
      getProductDetailsQuery(productId),
    );
    const { slug, variants, media } = getProductDetails.product;
    return { slug, variants, media };
  } catch (err) {
    if (retry == 4) {
      Logger.warn('Product fetch call failed', graphqlExceptionHandler(err));
      return;
    }
    Logger.warn(`${retry + 1} retry in product details get call`, {
      productId,
    });
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
    const productUpdate = await graphqlCall(
      updateProductMutation(productUpdateData, destinationId),
    );
    Logger.verbose('Product updated', productUpdate);
    return productUpdate;
  } catch (err) {
    if (retry == 6) {
      Logger.warn('Product update call failed', graphqlExceptionHandler(err));
      return;
    }
    Logger.warn(`${retry + 1} retry in product update  call`, {
      destinationId,
    });
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
