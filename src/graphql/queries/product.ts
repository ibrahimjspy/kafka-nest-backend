import { gql } from 'graphql-request';

export const getProductDetailsQuery = (productId: string): string => {
  return gql`
    query {
      product(id: "${productId}" channel: "default-channel") {
        name
        media {
          url
        }
        slug
        description
        updatedAt
        variants {
          pricing{
            price{
              gross{
                amount
              }
            }
          }
          id
        }
      }
    }
  `;
};
