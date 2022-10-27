import { gql } from 'graphql-request';

export const getProductDetailsQuery = (productId: string): string => {
  return gql`
    query {
      product(id: "${productId}") {
        name
        media {
          url
        }
        slug
        description
        updatedAt
        variants {
          id
        }
      }
    }
  `;
};
