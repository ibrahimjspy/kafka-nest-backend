import { gql } from 'graphql-request';

export const createProductVariantMutation = (productVariantData, productId) => {
  // parsing product variant data;
  const { color, size } = productVariantData;
  const COLOR_ATTRIBUTE_ID =
    process.env.DEFAULT_COLOR_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE3';
  const SIZE_ATTRIBUTE_ID =
    process.env.DEFAULT_SIZE_ATTRIBUTE_ID || 'QXR0cmlidXRlOjE4';

  return gql`
    mutation {
      productVariantCreate(
        input: {
          attributes: [
            { id: "${COLOR_ATTRIBUTE_ID}", plainText:"${color}" }
            { id: "${SIZE_ATTRIBUTE_ID}", plainText:"${size}" }
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
