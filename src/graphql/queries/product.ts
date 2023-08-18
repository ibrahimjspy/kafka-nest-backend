import { gql } from 'graphql-request';

export const getProductDetailsQuery = (productId: string): string => {
  return gql`
          query {
            product(id: "${productId}", channel: "default-channel") {
              media {
                id
                url
              }
              slug
              variants {
                media{
                  url
                }
                pricing {
                  price {
                    gross {
                      amount
                    }
                  }
                }
                attributes {
                  attribute {
                    name
                  }
                  values {
                    name
                  }
                }
                id
              }
            }
          }
  `;
};
