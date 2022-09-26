/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from 'graphql-request';

export const createProductMutation = (productData) => {
  // parsing product data;
  const seoTitle = productData.brand.information.seo_title;
  const seoDescription = productData.brand.seo_title;
  const productName = productData.style_name;
  return gql`
    mutation {
      productCreate(
        input: {
          productType: "UHJvZHVjdFR5cGU6MQ=="
          name: "${productName}"
          seo: { title: "${seoTitle}", description: "${seoDescription}" }
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
export const addOrangeShineIdMutation = (saleorResponse, productObject) => {
  const saleorId = saleorResponse.productCreate.product.id;
  const orangeShineId = productObject.id;
  console.log({ saleorId, orangeShineId });
  return gql`
    mutation {
      updateMetadata(
        id: "${saleorId}"
        input: { key: "OS_ID", value: "${orangeShineId}" }
      ) {
        item {
          __typename
        }
      }
    }
  `;
};
