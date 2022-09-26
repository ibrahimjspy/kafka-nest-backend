/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from 'graphql-request';

export const createProductMutation = (productData) => {
  const fallbackJSON = '{"phonetype":"N95","test":"WP"}';
  const fallbackString = '';

  return gql`
    mutation{
  productCreate(
    input: {
      attributes: [
        id: A1
        values: ["${productData.color || fallbackString}"]
      ]
      category: ${productData.category || fallbackString}

      description: "${productData.description || fallbackJSON}"
      name: "${productData.name}"
      seo: {
        title: "${productData.brand.seo_title || fallbackString}"
        description: "${productData.brand.seo_description || fallbackString}"
      }
      rating: "${productData.order_review.score || null}"
      productType: "UHJvZHVjdFR5cGU6MQ=="
    }
  )
  {
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
  const saleorId = saleorResponse.product.id;
  const orangeShineId = productObject.id;
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
