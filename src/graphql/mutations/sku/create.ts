import { gql } from 'graphql-request';

export const createSkuMutation = (productVariants) => {
  return gql`
    mutation {
      skuForProductVariants(
        Input: ${productVariants}
      ) {
        ... on SkuGeneratorForProductsType {
          productVariants {
            sku
          }
        }
      }
    }
  `;
};
