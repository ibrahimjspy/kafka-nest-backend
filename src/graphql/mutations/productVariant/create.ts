import { gql } from 'graphql-request';

export const createProductVariantMutation = (productVariantData, productId) => {
  // parsing product variant data;
  const { color, size } = productVariantData;
  return gql`
    mutation {
      productVariantCreate(
        input: {
          attributes: [
            { id: "QXR0cmlidXRlOjE3", values: ["${color}"] }
            { id: "QXR0cmlidXRlOjE4", values: ["${size}"] }
          ]
          name: "product_variant"
          product: "${productId}"
        }
      ) {
        productVariant {
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
