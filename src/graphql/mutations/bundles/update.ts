import { gql } from 'graphql-request';

export const updateBundlePricingMutation = (bundleIds: string[]) => {
  return gql`
    mutation {
      updateBundlesPricing(bundles: [${bundleIds.map((id) => {
        return `{bundleId: "${id}"}`;
      })}]) {
        ... on ResultData {
          data
        }
        ... on ResultError{
          message
        }
      }
    }
  `;
};
