import { gql } from 'graphql-request';
import { productTransformed } from 'src/transformer/types/product';

export const createProductMutation = (productData: productTransformed) => {
  // parsing product data;
  const DEFAULT_PRODUCT_TYPE =
    process.env.DEFAULT_PRODUCT_TYPE || 'UHJvZHVjdFR5cGU6Mg==';
  const { name, categoryId, description } = productData;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "${DEFAULT_PRODUCT_TYPE}"
          description:${JSON.stringify(description)}
          name: "${name}"
          category:"${categoryId}"
          rating: 4
        }
      ) {
        product {
          name
          id
          description
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
            channelId: "Q2hhbm5lbDox"
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
