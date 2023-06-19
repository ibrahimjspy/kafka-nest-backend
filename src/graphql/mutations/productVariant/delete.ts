import { gql } from 'graphql-request';

export const productVariantBulkDeleteMutation = (
  productVariantIds: string[],
) => {
  return gql`
    mutation {
      productVariantBulkDelete(ids: ${JSON.stringify(productVariantIds)}) {
        count
        errors {
          message
        }
      }
    }
  `;
};
