import { gql } from 'graphql-request';

/**
 * @warn -- currently only fetches first shipping zone as we are using default shipping zone and store shipping methods in it
 */
export const getShippingZonesQuery = (): string => {
  return gql`
    query {
      shippingZones(first: 1) {
        edges {
          node {
            id
            shippingMethods {
              id
              name
              metadata {
                key
                value
              }
            }
          }
        }
      }
    }
  `;
};
