import { gql } from 'graphql-request';

export const productBulkCreateMutation = (products: string) => {
  return gql`
    mutation {
      productBulkCreate(
        products: [${products}]
      ) {
        count
        errors {
          message
          code
          values
        }
        results {
          product {
            id
            externalReference
            variants {
              id
              attributes {
                attribute {
                  id
                  name
                }
                values {
                  value
                  name
                }
              }
            }
          }
        }
      }
    }
  `;
};
