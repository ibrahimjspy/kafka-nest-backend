import { gql } from 'graphql-request';
import { productTransformed } from 'src/types/transformers/product';

export const createProductMutation = (productData: productTransformed) => {
  // parsing product data;
  // const testProductType = "UHJvZHVjdFR5cGU6MQ=="
  const { name, description, categoryId } = productData;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "UHJvZHVjdFR5cGU6Mg=="
          name: "${name}"
          category:"${categoryId}"
          description:${JSON.stringify(description)}
          seo: { title: "seo title", description: "demo description" }
          rating: 4
        }
      ) {
        product {
          name
          id
          seoTitle
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
        id: "${productId?.productCreate?.product?.id}"
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
