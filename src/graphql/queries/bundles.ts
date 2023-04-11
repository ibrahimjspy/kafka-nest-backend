import { gql } from 'graphql-request';

export const getBundleIdsQuery = (productId: string): string => {
  return gql`
    query {
      bundles(
        Filter: { productId: "${productId}" }
        Paginate: { first: 100 }
      ) {
        ... on BundleConnectionType {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;
};
