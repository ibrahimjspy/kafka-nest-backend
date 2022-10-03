import { gql } from 'graphql-request';

export const testQuery = (): string => {
  return gql`
    query {
      products(
        first: 6
        channel: "default-channel"
        filter: { categories: ["Q2F0ZWdvcnk6MTM="] }
      ) {
        edges {
          node {
            id
            slug
            defaultVariant {
              sku
              pricing {
                price {
                  gross {
                    currency
                    amount
                  }
                }
              }
            }
            variants {
              attributes {
                attribute {
                  name
                }
                values {
                  name
                }
              }
            }
            thumbnail {
              url
            }
            name
            description
          }
        }
      }
    }
  `;
};
