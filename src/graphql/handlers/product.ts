import { Logger } from '@nestjs/common';
import {
  getProductDetailsInterface,
  productCreate,
} from 'src/graphql/types/product';
import { productTransformed } from 'src/transformer/types/product';
import { graphqlCall, graphqlExceptionHandler } from 'src/graphql/utils/call';
import {
  addProductToShopMutation,
  createProductMutation,
  productChannelListingMutation,
  updateProductMetadata,
  storeProductStatusMutation,
} from '../mutations/product/create';
import {
  deleteProductMutation,
  removeChannelListingMutation,
} from '../mutations/product/delete';
import { updateProductMutation } from '../mutations/product/update';
import { getProductDetailsQuery } from '../queries/product';
import { productBulkCreateMutation } from '../mutations/product/bulkCreate';
import { getBulkProductsGql } from '../utils/transformers';

//  <-->  Create  <-->

export const createProductHandler = async (
  productData: productTransformed,
): Promise<string> => {
  try {
    const createProduct: productCreate = await graphqlCall(
      createProductMutation(productData),
    );
    const productId = createProduct?.productCreate?.product?.id;
    await productChannelListingHandler(productId);

    Logger.verbose('Product created', createProduct);
    return productId;
  } catch (err) {
    Logger.error('Product create call failed', graphqlExceptionHandler(err));
    return;
  }
};

export const productChannelListingHandler = async (productId) => {
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

/**
 * Adds the product to the shop.
 * @param {string} productId - The ID of the product.
 * @param {productTransformed} productData - The transformed product data.
 * @returns {Promise<void>} A promise that resolves when the product is added to the shop.
 */
export const addProductToShopHandler = async (
  productId: string,
  productData: productTransformed,
): Promise<void> => {
  try {
    const response = await graphqlCall(
      addProductToShopMutation([productId], productData.shopId),
    );

    if (!response || !response['addProductsToShop']) {
      throw new Error('Invalid response from addProductsToShop mutation');
    }

    const { name } = response['addProductsToShop'];
    await updateProductMetadataHandler(productId, productData, name);
    Logger.verbose(`Product with ID ${productId} added to shop: ${name}`);
  } catch (error) {
    const errorMessage = 'Product add to shop call failed';
    Logger.error(errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const storeProductStatusHandler = async (productId: string) => {
  try {
    return await graphqlCall(storeProductStatusMutation(productId));
  } catch (err) {
    Logger.error(
      'product status storage call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};

export const updateProductMetadataHandler = async (
  productId: string,
  productData: productTransformed,
  shopName?: string,
) => {
  try {
    return await graphqlCall(
      updateProductMetadata(productId, productData, shopName),
    );
  } catch (err) {
    Logger.error(
      'product status storage call failed',
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
    if (getProductDetails?.product?.slug) {
      const { slug, variants, media } = getProductDetails.product;
      return { slug, variants, media, productId };
    }
    return await getProductDetailsHandler(productId);
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

export const removeChannelListingHandler = async (productId: string) => {
  try {
    return await graphqlCall(removeChannelListingMutation(productId));
  } catch (err) {
    Logger.warn(
      'product channel update call failed',
      graphqlExceptionHandler(err),
    );
    return;
  }
};

export const createBulkProductsHandler = async (
  productsData: productTransformed[],
): Promise<object> => {
  try {
    const createBulkProducts = await graphqlCall(
      productBulkCreateMutation(`${getBulkProductsGql(productsData)}`),
    );
    Logger.verbose('Bulk Products created', createBulkProducts);
    return createBulkProducts;
  } catch (err) {
    Logger.error('Product create call failed', graphqlExceptionHandler(err));
    return;
  }
};
