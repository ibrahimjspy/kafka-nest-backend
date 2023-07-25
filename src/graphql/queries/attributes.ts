import { gql } from 'graphql-request';

/**
 * @warn -- returns only top 100 attributes
 */
export const getAttributesQuery = (): string => {
  const PAGINATION = `first: 100`;
  return gql`
    query {
      attributes(${PAGINATION}) {
        edges {
          node {
            id
            name
            slug
            type
            inputType
          }
        }
      }
    }
  `;
};
