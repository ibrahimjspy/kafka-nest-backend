import { gql } from 'graphql-request';

export const createProductVariantMutation = (productVariantData, productId) => {
  // parsing product variant data;
  const { color, size } = productVariantData;
  const COLOR_ATTRIBUTE_ID = 'QXR0cmlidXRlOjE3';
  const SIZE_ATTRIBUTE_ID = 'QXR0cmlidXRlOjE4';

  return gql`
    mutation {
      productVariantCreate(
        input: {
          attributes: [
            { id: "${COLOR_ATTRIBUTE_ID}", values: ["${color}"] }
            { id: "${SIZE_ATTRIBUTE_ID}", values: ["${size}"] }
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
