/* eslint-disable prettier/prettier */
import {
  DEFAULT_CHANNEL_ID,
  DEFAULT_PRODUCT_TYPE,
} from '../../../../common.env';
import { gql } from 'graphql-request';
import { ProductAttributes } from 'src/app.utils.types';
import { getProductAttributesGql, productMetadataTransformer } from 'src/graphql/utils/transformers';
import { productTransformed } from 'src/transformer/types/product';

export const createProductMutation = (productData: productTransformed, 
  attributes: ProductAttributes) => {
  // parsing product data;
  const {
    name,
    categoryId,
    description,
    id,
  } = productData;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "${DEFAULT_PRODUCT_TYPE}"
          description:${JSON.stringify(description)}
          name: "${name}"
          externalReference:"${id}"
          attributes: ${getProductAttributesGql(productData, attributes)}
          category:"${categoryId}"
          rating: 4
        }
      ) {
        product {
          name
          id
          slug
        }
        errors {
          field
          message
        }
      }
    }
  `;
};

export const productChannelListingMutation = (productId) => {
  return gql`
    mutation {
      productChannelListingUpdate(
        id: "${productId}"
        input: {
          updateChannels: {
            channelId: "${DEFAULT_CHANNEL_ID}"
            visibleInListings: true
            isAvailableForPurchase: true
            isPublished: true
          }
        }
      ) {
        product {
          id
          name
        }
        errors {
          message
        }
      }
    }
  `;
};

export const addProductToShopMutation = (
  productId: string,
  shopId: string,
  isOpenPack: boolean,
) => {
  return gql`
    mutation {
      addProductsToShop(Input: { products: [{productId: ${productId}, isOpenPack: ${isOpenPack}}]}, shopId: "${shopId}" }) {
        id
        name
      }
    }
  `;
};

export const storeProductStatusMutation = (productId: string) => {
  return gql`
    mutation {
      updatePrivateMetadata(
        id: "${productId}"
        input: { key: "status", value: "product_created" }
      ) {
        item {
          metadata {
            key
            value
          }
        }
      }
    }
  `;
};

export const updateProductMetadata = (
  productId: string,
  productData: productTransformed,
  shopName: string,
) => {
  const { shopId, openPack, openPackMinimumQuantity } = productData;
  return gql`
    mutation {
      updateMetadata(
        id: "${productId}"
        input: ${productMetadataTransformer(
          shopId,
          openPack,
          openPackMinimumQuantity,
          shopName,
        )}
      ) {
        item {
          metadata {
            key
            value
          }
        }
      }
    }
  `;
};
