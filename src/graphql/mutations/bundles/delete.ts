import { gql } from 'graphql-request';

export const productBundleDeleteMutation = (bundleId: string) => {
  return gql`
    mutation {
      deleteBundle(bundleId: "${bundleId}") {
        ... on ResultData {
          message
        }
        ... on ResultError {
          errors
        }
      }
    }
  `;
};
