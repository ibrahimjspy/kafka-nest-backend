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
          code
        }
      }
    }
  `;
};

export const addProductVariantsToShopMutation = (variantsIds, shopId) => {
  return gql`
    mutation {
      addProductVariantsToShop(input: { productVariantIds: ${JSON.stringify(
        variantsIds,
      )}, shopId: "${shopId}" }) {
        id
      }
    }
  `;
};
