import { gql } from 'graphql-request';

export const getBundleIdsQuery = (
  productId: string,
  productVariantIds?: string[],
): string => {
  const filter = productVariantIds
    ? `Filter: { productVariantIds: ${JSON.stringify(productVariantIds)} }`
    : `Filter: { productId: "${productId}" }`;
  return gql`
    query {
      bundles(
        ${filter}
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
