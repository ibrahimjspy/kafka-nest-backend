import { gql } from 'graphql-request';
import { productTransformed } from 'src/transformer/types/product';

export const createProductMutation = (productData: productTransformed) => {
  // parsing product data;
  const DEFAULT_PRODUCT_TYPE =
    process.env.DEFAULT_PRODUCT_TYPE || 'UHJvZHVjdFR5cGU6Mg==';
  const STYLE_ATTRIBUTE_ID =
    process.env.STYLE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjU=';
  const { name, categoryId, description, styleNumber } = productData;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "${DEFAULT_PRODUCT_TYPE}"
          description:${JSON.stringify(description)}
          name: "${name}"
          attributes:[{
            id:"${STYLE_ATTRIBUTE_ID}",
            values:["${styleNumber}"]
          }]
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
  const DEFAULT_CHANNEL = 'Q2hhbm5lbDox';
  return gql`
    mutation {
      productChannelListingUpdate(
        id: "${productId}"
        input: {
          updateChannels: {
            channelId: "${DEFAULT_CHANNEL}"
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
  productIds: string[],
  shopId: string,
) => {
  return gql`
    mutation {
      addProductToShop(Input: { productIds: ${JSON.stringify(
        productIds,
      )}, shopId: "${shopId}" }) {
        id
      }
    }
  `;
};
