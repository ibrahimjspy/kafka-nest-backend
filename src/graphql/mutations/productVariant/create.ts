import { gql } from 'graphql-request';

export const productVariantBulkCreateMutation = (
  productVariantData,
  productId,
) => {
  return gql`
    mutation {
      productVariantBulkCreate(
        product: "${productId}"
        variants: [${productVariantData}]
      ) {
        productVariants {
          id
          attributes {
            attribute {
              id
              name
            }
            values {
              value
              name
            }
          }
        }
        errors {
          message
        }
      }
    }
  `;
};

export const addProductVariantToShopMutation = (variantId, shopId) => {
  return gql`
    mutation {
      addProductVariantToShop(
        input: {
          productVariantId: "${variantId}"
          shopId: "${shopId}"
        }
      ) {
         name
       }
    }
  `;
};
