/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from 'graphql-request';

export const createProductMutation = (productData) => {
  console.log(productData);
  // parsing product data;
  // const testProductType = "UHJvZHVjdFR5cGU6MQ=="
  const { id, name, description } = productData;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "UHJvZHVjdFR5cGU6MTc="
          name: "${name}"
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

export const addOrangeShineIdMutation = (
  destinationResponse,
  productObject,
) => {
  const destinationId = destinationResponse.productCreate.product.id;
  const orangeShineId = productObject.id;
  console.log({ destinationId, orangeShineId });
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
