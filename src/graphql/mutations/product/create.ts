import { gql } from 'graphql-request';
import { productTransformed } from 'src/types/transformers/product';

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
          name: "${name}"
          description:${JSON.stringify(description)}
          category:"${categoryId}"
          seo: { title: "seo title", description: "demo description" }
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

export const addOrangeShineIdMutation = (
  destinationResponse,
  productObject,
) => {
  const destinationId = destinationResponse.productCreate.product.id;
  const orangeShineId = productObject.id;
  return gql`
    mutation {
      updateMetadata(
        id: "${destinationId}"
        input: { key: "OS_ID", value: "${orangeShineId}" }
      ) {
        item {
          __typename
        }
      }
    }
  `;
};
